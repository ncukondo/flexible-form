import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { FormDefinitionForView } from "../../form-definition/schema";

const { PREFILLED_URL } = vi.hoisted(() => ({
  PREFILLED_URL: "https://form.example/v/id?data.name=PREFILLED",
}));
const redirect = vi.fn();
const getFormAction = vi.fn();
const sendSystemMessageMail = vi.fn();

vi.mock("next/navigation", () => ({ redirect }));
vi.mock("@/common/url/init-server-url", () => ({}));
vi.mock("@/common/url", () => ({ makePrefilledUrl: () => PREFILLED_URL }));
vi.mock("../send-mail", () => ({ sendSystemMessageMail }));
vi.mock("../../../features/form-definition/server/get", () => ({ getFormAction }));

const SIGNED_URL = "https://hook.example/workflows/1?sig=SECRET_SIGNATURE";
const STUDENT_INPUT = "STUDENT_FREE_TEXT";
const RESPONSE_BODY = "RESPONSE_BODY_TEXT";

const definition: FormDefinitionForView = {
  title: "Test form",
  description: "",
  items: [
    {
      type: "short_text",
      id: "name",
      title: "Name",
      description: "",
      required: true,
      visible_when: undefined,
    },
  ],
};

const expectedPayload = {
  form: "id",
  title: "Test form",
  description: "",
  value: { name: STUDENT_INPUT },
  keys: ["name"],
  schema: definition.items,
  prefilledUrl: PREFILLED_URL,
};

const submit = async () => {
  const { submitFormAction } = await import("../actions");
  return submitFormAction("id", { name: STUDENT_INPUT }, definition);
};

describe("submitFormAction logging", () => {
  const fetchMock = vi.fn();
  let logSpy: ReturnType<typeof vi.spyOn>;
  let errorSpy: ReturnType<typeof vi.spyOn>;
  const loggedText = () =>
    [...logSpy.mock.calls, ...errorSpy.mock.calls].flat().map(String).join("\n");

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", fetchMock);
    logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    logSpy.mockRestore();
    errorSpy.mockRestore();
  });

  it("logs only the destination type and status on https success", async () => {
    getFormAction.mockResolvedValue([SIGNED_URL]);
    fetchMock.mockResolvedValue(new Response(RESPONSE_BODY, { status: 200 }));

    await submit();

    expect(logSpy.mock.calls).toEqual([["submit action", "https", "status", 200]]);
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it("logs only the destination type and status on https failure", async () => {
    getFormAction.mockResolvedValue([SIGNED_URL]);
    fetchMock.mockResolvedValue(new Response(RESPONSE_BODY, { status: 500 }));

    const result = await submit();

    expect(errorSpy.mock.calls).toEqual([["submit action failed", "https", "status", 500]]);
    expect(logSpy).not.toHaveBeenCalled();
    expect(result).toEqual({ success: false, errors: [{ type: "webhook", detail: "HTTP 500" }] });
    expect(redirect).not.toHaveBeenCalled();
  });

  it.each([
    ["success", 200],
    ["failure", 500],
  ])("never logs student input, url or response body on https %s", async (_, status) => {
    getFormAction.mockResolvedValue([SIGNED_URL]);
    fetchMock.mockResolvedValue(new Response(RESPONSE_BODY, { status }));

    await submit();

    const text = loggedText();
    for (const secret of [STUDENT_INPUT, "SECRET_SIGNATURE", "hook.example", RESPONSE_BODY]) {
      expect(text).not.toContain(secret);
    }
  });

  it("keeps the https request and redirect unchanged", async () => {
    getFormAction.mockResolvedValue([SIGNED_URL]);
    fetchMock.mockResolvedValue(new Response("", { status: 200 }));

    await submit();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(SIGNED_URL);
    expect(init.method).toBe("POST");
    expect(init.headers).toEqual({ "Content-Type": "application/json" });
    expect(JSON.parse(init.body)).toEqual(expectedPayload);
    expect(redirect).toHaveBeenCalledWith("/view/thank-you?id_for_view=id");
  });

  it("keeps the log: action output unchanged", async () => {
    getFormAction.mockResolvedValue(["log:"]);

    await submit();

    expect(fetchMock).not.toHaveBeenCalled();
    expect(logSpy.mock.calls).toEqual([[JSON.stringify(expectedPayload, null, 2)]]);
  });
});
