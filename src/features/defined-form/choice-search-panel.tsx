"use client";
import { useRef, useState, type KeyboardEvent } from "react";
import { Control, FieldErrors, UseFormRegister, useWatch } from "react-hook-form";
import { matchesQuery, toSelectedValues } from "./choice-search";
import { Description, ItemTitle } from "./form-item";
import { ChoiceItemDefinition, FormItemDefinition } from "../form-definition/schema";

const isSearchableItem = (item: FormItemDefinition): item is ChoiceItemDefinition =>
  item.type === "choice" && item.multiple;

const LIST_TOGGLE_CLASS = [
  "flex min-h-[2.75rem] w-full items-center justify-between gap-x-3",
  "text-left text-sm font-bold text-base-content/75",
].join(" ");

const CHIP_CLASS = [
  "flex min-h-[2.5rem] cursor-pointer items-center gap-x-2",
  "rounded-lg border border-base-300 px-2 py-1",
  "has-[:checked]:border-primary has-[:checked]:bg-primary/10",
].join(" ");

const checkboxId = (item: ChoiceItemDefinition, value: string) => `${item.id}.${value}`;

/** Keeps the query on the last confirmed text while an input method is converting. */
const useConfirmedQuery = () => {
  const [text, setText] = useState("");
  const [query, setQuery] = useState("");
  const isComposing = useRef(false);
  const inputProps = {
    value: text,
    onChange: (e: { target: HTMLInputElement }) => {
      setText(e.target.value);
      if (!isComposing.current) setQuery(e.target.value);
    },
    onCompositionStart: () => {
      isComposing.current = true;
    },
    onCompositionEnd: (e: { currentTarget: HTMLInputElement }) => {
      isComposing.current = false;
      setText(e.currentTarget.value);
      setQuery(e.currentTarget.value);
    },
    onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== "Enter") return;
      // Enter that confirms a conversion must reach the input method.
      if (e.nativeEvent.isComposing || e.keyCode === 229) return;
      e.preventDefault();
    },
  };
  return { query, inputProps };
};

type ChoiceSearchPanelProps = {
  items: ChoiceItemDefinition[];
  register: UseFormRegister<any>;
  control: Control<any>;
  errors: FieldErrors;
};

/**
 * Every checkbox stays mounted once, in definition order, and is only hidden. This keeps
 * react-hook-form reading the same inputs as the default layout, so the initial selection
 * and the submitted values do not depend on the layout.
 */
function ChoiceSearchPanel({ items, register, control, errors }: ChoiceSearchPanelProps) {
  const { query, inputProps } = useConfirmedQuery();
  const watched: unknown[] = useWatch({ control, name: items.map(item => item.id) });
  const [collapsedIds, setCollapsedIds] = useState<ReadonlySet<string>>(new Set());

  const isSearching = query.trim() !== "";
  const isShown = (title: string) => !isSearching || matchesQuery(title, query);
  const resultCount = items.flatMap(({ choices }) => choices).filter(c => isShown(c.title)).length;

  const toggleCollapsed = (id: string) => {
    const next = new Set(collapsedIds);
    if (!next.delete(id)) next.add(id);
    setCollapsedIds(next);
  };

  const remove = (item: ChoiceItemDefinition, value: string) => {
    // Through the checkbox itself, so that removing takes the same path as unchecking.
    document.getElementById(checkboxId(item, value))?.click();
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="sticky top-0 z-10 bg-base-100 py-2 print:hidden">
        <label className="grid gap-1">
          <span className="text-sm font-bold text-base-content/75">
            経験した項目を検索して追加
          </span>
          <input
            {...inputProps}
            type="search"
            enterKeyHint="search"
            autoComplete="off"
            placeholder="例: 発熱"
            className="input input-bordered w-full text-base"
          />
        </label>
        <div role="status" className="pt-1 text-sm text-base-content/75 empty:hidden">
          {isSearching && (resultCount > 0 ? `${resultCount}件` : "見つかりません")}
        </div>
      </div>
      <div
        data-choice-lists
        className={`grid gap-4 print:hidden ${isSearching ? "order-1" : "order-2"}`}
      >
        {items.map(item => {
          const isCollapsed = collapsedIds.has(item.id);
          return (
            <section
              key={item.id}
              data-choice-list={item.id}
              hidden={isSearching && !item.choices.some(c => isShown(c.title))}
            >
              {!isSearching && (
                <button
                  type="button"
                  aria-expanded={!isCollapsed}
                  className={LIST_TOGGLE_CLASS}
                  onClick={() => toggleCollapsed(item.id)}
                >
                  <span>
                    {item.title}の一覧（{item.choices.length}項目）
                  </span>
                  <span aria-hidden>{isCollapsed ? "▼" : "▲"}</span>
                </button>
              )}
              <div hidden={isCollapsed && !isSearching}>
                <div className="flex flex-wrap gap-2">
                  {item.choices.map(choice => (
                    <div
                      key={choice.value}
                      data-search-result
                      className="max-w-full"
                      hidden={!isShown(choice.title)}
                    >
                      <label className={CHIP_CLASS}>
                        <input
                          type="checkbox"
                          className="checkbox checkbox-sm"
                          {...register(item.id)}
                          value={choice.value}
                          id={checkboxId(item, choice.value)}
                        />
                        <span className="grid">
                          <span className="label-text">{choice.title}</span>
                          {isSearching && (
                            <span className="text-xs text-base-content/60">{item.title}</span>
                          )}
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </div>
      <div data-selected-groups className={`grid gap-8 ${isSearching ? "order-2" : "order-1"}`}>
        {items.map((item, i) => {
          const values = toSelectedValues(watched[i]);
          const selected = item.choices.filter(({ value }) => values.includes(value));
          const error = errors[item.id];
          return (
            <section key={item.id} data-selected-group={item.id}>
              <ItemTitle title={item.title} required={item.required} />
              <Description description={item.description} />
              <div className="text-error">{error?.message?.toString()}</div>
              {selected.length === 0 && (
                <div className="py-2 text-sm text-base-content/60">選択なし</div>
              )}
              <ul>
                {selected.map(({ title, value }) => (
                  <li
                    key={value}
                    className="flex items-center justify-between gap-x-3 border-b border-base-200"
                  >
                    <span data-selected-item className="label-text">
                      {title}
                    </span>
                    <button
                      type="button"
                      aria-label={`${title}を外す`}
                      className="btn btn-ghost btn-square shrink-0 print:hidden"
                      onClick={() => remove(item, value)}
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}

export { ChoiceSearchPanel, isSearchableItem };
