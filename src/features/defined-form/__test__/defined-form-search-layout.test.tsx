import { createRoot, type Root } from "react-dom/client";
import { act } from "react-dom/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { makeDefaultValues, setCurrentUrlGetter } from "@/common/url";
import {
  safeParseFormDefinitionForView,
  type FormDefinitionForView,
} from "../../form-definition/schema";
import { submitFormAction } from "../actions";
import { DefinedForm } from "../defined-form";

const { getFormAction } = vi.hoisted(() => ({ getFormAction: vi.fn() }));

vi.mock("next/navigation", () => ({ redirect: vi.fn() }));
vi.mock("@/common/url/init-server-url", () => ({}));
vi.mock("../send-mail", () => ({ sendSystemMessageMail: vi.fn() }));
vi.mock("../../../features/form-definition/server/get", () => ({ getFormAction }));

const FORM_ID = "form-id";

const rawDefinition = {
  title: "経験確認",
  description: "説明",
  items: [
    { type: "constant", id: "id", title: "id", value: "" },
    {
      type: "choice",
      id: "procedures",
      title: "基本的臨床技能",
      multiple: true,
      choices: [
        { title: "皮膚消毒", value: "P1" },
        { title: "気道内吸引", value: "P2" },
      ],
    },
    {
      type: "choice",
      id: "symptoms",
      title: "症候",
      multiple: true,
      choices: [
        { title: "発熱", value: "S1" },
        { title: "全身倦怠感", value: "S2" },
        { title: "めまい", value: "S3" },
      ],
    },
    {
      type: "choice",
      id: "diseases",
      title: "疾患",
      multiple: true,
      choices: [
        { title: "発熱性好中球減少症", value: "D1" },
        { title: "脳出血", value: "D2" },
      ],
    },
    {
      type: "choice",
      id: "grade",
      title: "学年",
      choices: [
        { title: "5年", value: "G5" },
        { title: "6年", value: "G6" },
      ],
    },
    { type: "long_text", id: "comment", title: "コメント" },
  ],
};

const parseDefinition = (raw: unknown) => {
  const parsed = safeParseFormDefinitionForView(raw);
  if (!parsed.success) throw parsed.error;
  return parsed.data;
};

const definitions = {
  default: parseDefinition(rawDefinition),
  search: parseDefinition({ ...rawDefinition, layout: "search" }),
};

const flush = () =>
  act(async () => {
    await new Promise(resolve => setTimeout(resolve, 0));
  });

let root: Root | null = null;
let container: HTMLDivElement;

const mount = async (
  definition: FormDefinitionForView,
  searchParams: Record<string, string>,
  onSubmit: (data: unknown) => void = () => {},
) => {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  const defaultValues = makeDefaultValues(searchParams);
  await act(async () => {
    root?.render(<DefinedForm {...{ formDefinition: definition, defaultValues, onSubmit }} />);
  });
  await flush();
};

const unmount = () => {
  act(() => root?.unmount());
  root = null;
  container?.remove();
};

const checkbox = (itemId: string, value: string) =>
  container.querySelector<HTMLInputElement>(`[id="${itemId}.${value}"]`) as HTMLInputElement;
const checkedValues = (itemId: string) =>
  [...container.querySelectorAll<HTMLInputElement>(`input[name="${itemId}"]`)]
    .filter(input => input.checked)
    .map(input => input.value);
const sendButton = () => container.querySelector("button[type=submit]") as HTMLButtonElement;
const resetButton = () =>
  [...container.querySelectorAll("button")].find(b => b.textContent === "reset") as HTMLElement;
const searchInput = () => container.querySelector("input[type=search]") as HTMLInputElement;
const removeButton = (title: string) =>
  container.querySelector<HTMLButtonElement>(`button[aria-label="${title}を外す"]`);

const click = async (element: HTMLElement) => {
  await act(async () => element.click());
  await flush();
};

const setText = async (input: HTMLInputElement, text: string) => {
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
  await act(async () => {
    setter?.call(input, text);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
};

const visibleResults = () =>
  [...container.querySelectorAll<HTMLElement>("[data-search-result]")]
    .filter(row => row.closest("[hidden]") === null)
    .map(row => row.textContent);

const dispatchSubmit = async () => {
  const form = container.querySelector("form") as HTMLFormElement;
  await act(async () => {
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
  });
  await flush();
};

/** Sends the form through the real action and returns the raw webhook body. */
const webhookBody = async (
  layout: keyof typeof definitions,
  searchParams: Record<string, string>,
  operate: () => Promise<void> = async () => {},
) => {
  const definition = definitions[layout];
  const fetchMock = vi.fn(async () => new Response("", { status: 200 }));
  vi.stubGlobal("fetch", fetchMock);
  const submitted: unknown[] = [];
  await mount(definition, searchParams, data => submitted.push(data));
  await operate();
  await dispatchSubmit();
  expect(submitted).toHaveLength(1);
  await submitFormAction(FORM_ID, submitted[0], definition);
  unmount();
  expect(fetchMock).toHaveBeenCalledTimes(1);
  const [, init] = fetchMock.mock.calls[0] as unknown as [string, { body: string }];
  return init.body;
};

const urlParams = {
  "data.id": "student-1",
  "data.symptoms.0": "S3",
  "data.symptoms.1": "S1",
  "data.diseases.0": "D2",
};

beforeEach(() => {
  setCurrentUrlGetter(() => new URL("https://form.example/"));
  getFormAction.mockResolvedValue(["https://hook.example/run?sig=x"]);
  vi.spyOn(console, "log").mockImplementation(() => {});
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
});

afterEach(() => {
  unmount();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("default layout (today's behaviour)", () => {
  it("sends url candidates in the url order when untouched", async () => {
    const body = JSON.parse(await webhookBody("default", urlParams));
    expect(body.value).toEqual({
      id: "student-1",
      procedures: [],
      symptoms: ["S3", "S1"],
      diseases: ["D2"],
      grade: "",
      comment: "",
    });
    expect(body.keys).toEqual(["id", "procedures", "symptoms", "diseases", "grade", "comment"]);
    expect(body.schema).toEqual(definitions.default.items);
    expect(body.prefilledUrl).toBe(
      `https://form.example/v/${FORM_ID}?data.id=student-1&data.symptoms.0=S3` +
        "&data.symptoms.1=S1&data.diseases.0=D2",
    );
  });

  it("sends definition order after a change", async () => {
    const body = JSON.parse(
      await webhookBody("default", urlParams, async () => {
        await click(checkbox("symptoms", "S2"));
      }),
    );
    expect(body.value.symptoms).toEqual(["S1", "S2", "S3"]);
  });

  it("shows no search input", async () => {
    await mount(definitions.default, urlParams);
    expect(searchInput()).toBeNull();
    expect(checkbox("symptoms", "S1").closest("[hidden]")).toBeNull();
  });
});

describe("search layout keeps the webhook data the same as the default layout", () => {
  it("does not add anything to the schema sent to the webhook", () => {
    expect(definitions.search.items).toEqual(definitions.default.items);
  });

  it.each([
    ["no url parameters", {}],
    ["candidates out of definition order", urlParams],
    ["a single candidate", { "data.symptoms.0": "S2" }],
    ["candidates with gaps in the index", { "data.symptoms.3": "S2", "data.symptoms.7": "S1" }],
    ["text values", { "data.comment": "コメント", "data.grade": "G6" }],
  ])("untouched with %s", async (_, params) => {
    const expected = await webhookBody("default", params);
    expect(await webhookBody("search", params)).toBe(expected);
  });

  it("selects the same candidates initially", async () => {
    await mount(definitions.default, urlParams);
    const expected = ["procedures", "symptoms", "diseases"].map(checkedValues);
    unmount();
    await mount(definitions.search, urlParams);
    expect(["procedures", "symptoms", "diseases"].map(checkedValues)).toEqual(expected);
  });

  it("adding from search results matches checking in the default layout", async () => {
    const expected = await webhookBody("default", urlParams, async () => {
      await click(checkbox("procedures", "P2"));
    });
    const actual = await webhookBody("search", urlParams, async () => {
      await setText(searchInput(), "気道");
      await click(checkbox("procedures", "P2"));
    });
    expect(actual).toBe(expected);
  });

  it("removing a selected item matches unchecking in the default layout", async () => {
    const expected = await webhookBody("default", urlParams, async () => {
      await click(checkbox("symptoms", "S3"));
    });
    const actual = await webhookBody("search", urlParams, async () => {
      await click(removeButton("めまい") as HTMLElement);
    });
    expect(actual).toBe(expected);
  });

  it("removing every candidate matches unchecking them all", async () => {
    const expected = await webhookBody("default", { "data.symptoms.0": "S1" }, async () => {
      await click(checkbox("symptoms", "S1"));
    });
    const actual = await webhookBody("search", { "data.symptoms.0": "S1" }, async () => {
      await click(removeButton("発熱") as HTMLElement);
    });
    expect(actual).toBe(expected);
    expect(JSON.parse(actual).value.symptoms).toEqual([]);
  });

  it("reset restores the candidates the same way", async () => {
    const operate = (remove: () => Promise<void>) => async () => {
      await remove();
      await click(resetButton());
    };
    const expected = await webhookBody(
      "default",
      urlParams,
      operate(() => click(checkbox("symptoms", "S3"))),
    );
    const actual = await webhookBody(
      "search",
      urlParams,
      operate(() => click(removeButton("めまい") as HTMLElement)),
    );
    expect(actual).toBe(expected);
  });

  it.each([
    ["an id outside the definition", { "data.symptoms.0": "S1", "data.symptoms.1": "UNKNOWN" }],
    ["a bare value without an index", { "data.symptoms": "S2" }],
  ])("disables send the same way for %s", async (_, params) => {
    await mount(definitions.default, params);
    const expected = sendButton().disabled;
    unmount();
    await mount(definitions.search, params);
    expect(expected).toBe(true);
    expect(sendButton().disabled).toBe(expected);
  });
});

describe("search layout display", () => {
  it("shows one search input and lists every choice before searching", async () => {
    await mount(definitions.search, urlParams);
    expect(container.querySelectorAll("input[type=search]")).toHaveLength(1);
    expect(visibleResults()).toEqual([
      "皮膚消毒",
      "気道内吸引",
      "発熱",
      "全身倦怠感",
      "めまい",
      "発熱性好中球減少症",
      "脳出血",
    ]);
  });

  it("shows selected items before the list of every choice", async () => {
    await mount(definitions.search, urlParams);
    const selected = container.querySelector("[data-selected-groups]") as HTMLElement;
    const list = container.querySelector("[data-choice-lists]") as HTMLElement;
    expect(selected.className).toContain("order-1");
    expect(list.className).toContain("order-2");
    await setText(searchInput(), "発熱");
    expect(list.className).toContain("order-1");
    expect(selected.className).toContain("order-2");
  });

  it("collapses one category of the list and keeps its selections", async () => {
    await mount(definitions.search, urlParams);
    const toggle = container.querySelector(
      '[data-choice-list="symptoms"] button',
    ) as HTMLButtonElement;
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    expect(toggle.type).toBe("button");
    await click(toggle);
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(visibleResults()).toEqual(["皮膚消毒", "気道内吸引", "発熱性好中球減少症", "脳出血"]);
    expect(checkedValues("symptoms")).toEqual(["S1", "S3"]);
  });

  it("searches collapsed categories too", async () => {
    await mount(definitions.search, {});
    await click(
      container.querySelector('[data-choice-list="symptoms"] button') as HTMLButtonElement,
    );
    await setText(searchInput(), "めまい");
    expect(visibleResults()).toEqual(["めまい症候"]);
  });

  it("checking a choice in the list adds it to the selected group", async () => {
    await mount(definitions.search, {});
    await click(checkbox("symptoms", "S2"));
    expect(removeButton("全身倦怠感")).not.toBeNull();
  });

  it("puts the search input before the other form items", async () => {
    await mount(definitions.search, urlParams);
    const comment = container.querySelector("textarea") as HTMLElement;
    expect(
      searchInput().compareDocumentPosition(comment) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it("finds partial matches across every category and names the category", async () => {
    await mount(definitions.search, {});
    await setText(searchInput(), "発熱");
    expect(visibleResults()).toEqual(["発熱症候", "発熱性好中球減少症疾患"]);
  });

  it("does not list single choice items in the search", async () => {
    await mount(definitions.search, {});
    await setText(searchInput(), "5年");
    expect(visibleResults()).toEqual([]);
    expect(checkbox("grade", "G5").closest("[hidden]")).toBeNull();
  });

  it("groups selected items by category in definition order", async () => {
    await mount(definitions.search, urlParams);
    const groups = [...container.querySelectorAll<HTMLElement>("[data-selected-group]")].map(
      group => [
        group.dataset.selectedGroup,
        [...group.querySelectorAll("[data-selected-item]")].map(item => item.textContent),
      ],
    );
    expect(groups).toEqual([
      ["procedures", []],
      ["symptoms", ["発熱", "めまい"]],
      ["diseases", ["脳出血"]],
    ]);
  });

  it("removes an item from the selected group and unchecks it", async () => {
    await mount(definitions.search, urlParams);
    await click(removeButton("めまい") as HTMLElement);
    expect(removeButton("めまい")).toBeNull();
    expect(checkedValues("symptoms")).toEqual(["S1"]);
  });

  it("adds a checked search result to the selected group", async () => {
    await mount(definitions.search, {});
    await setText(searchInput(), "脳出血");
    await click(checkbox("diseases", "D2"));
    expect(removeButton("脳出血")).not.toBeNull();
  });

  it("keeps selections while the query changes", async () => {
    await mount(definitions.search, urlParams);
    await setText(searchInput(), "気道");
    await setText(searchInput(), "");
    expect(checkedValues("symptoms")).toEqual(["S1", "S3"]);
  });

  it("tells when nothing is found", async () => {
    await mount(definitions.search, {});
    await setText(searchInput(), "該当なし");
    expect(container.textContent).toContain("見つかりません");
  });
});

describe("search layout with an input method", () => {
  const compose = async (type: "compositionstart" | "compositionend", data = "") => {
    await act(async () => {
      searchInput().dispatchEvent(new CompositionEvent(type, { bubbles: true, data }));
    });
  };

  it("does not filter on text still being converted", async () => {
    await mount(definitions.search, {});
    await compose("compositionstart");
    await setText(searchInput(), "はつねつ");
    expect(searchInput().value).toBe("はつねつ");
    expect(visibleResults()).toHaveLength(7);
    expect(container.textContent).not.toContain("見つかりません");
  });

  it("filters once the conversion is confirmed", async () => {
    await mount(definitions.search, {});
    await compose("compositionstart");
    await setText(searchInput(), "脳出血");
    await compose("compositionend", "脳出血");
    expect(visibleResults()).toEqual(["脳出血疾患"]);
  });

  it("does not submit the form with Enter", async () => {
    const onSubmit = vi.fn();
    await mount(definitions.search, {}, onSubmit);
    const event = new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true });
    await act(async () => {
      searchInput().dispatchEvent(event);
    });
    expect(event.defaultPrevented).toBe(true);
  });

  it("leaves Enter alone while converting", async () => {
    await mount(definitions.search, {});
    await compose("compositionstart");
    const event = new KeyboardEvent("keydown", {
      key: "Enter",
      bubbles: true,
      cancelable: true,
      isComposing: true,
    });
    await act(async () => {
      searchInput().dispatchEvent(event);
    });
    expect(event.defaultPrevented).toBe(false);
  });
});
