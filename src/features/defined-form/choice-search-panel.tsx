"use client";
import { useRef, useState, type KeyboardEvent } from "react";
import { Control, FieldErrors, UseFormRegister, useWatch } from "react-hook-form";
import { matchesQuery, toSelectedValues } from "./choice-search";
import { Description, ItemTitle } from "./form-item";
import { ChoiceItemDefinition, FormItemDefinition } from "../form-definition/schema";

const isSearchableItem = (item: FormItemDefinition): item is ChoiceItemDefinition =>
  item.type === "choice" && item.multiple;

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

  const isSearching = query.trim() !== "";
  const isMatch = (title: string) => matchesQuery(title, query);
  const resultCount = items.flatMap(({ choices }) => choices).filter(c => isMatch(c.title)).length;

  const remove = (item: ChoiceItemDefinition, value: string) => {
    // Through the checkbox itself, so that removing takes the same path as unchecking.
    document.getElementById(checkboxId(item, value))?.click();
  };

  return (
    <div className="grid gap-8">
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
      </div>
      <div role="status" className="text-sm text-base-content/75 empty:hidden print:hidden">
        {isSearching && (resultCount > 0 ? `${resultCount}件` : "見つかりません")}
      </div>
      <div className={isSearching ? "print:hidden" : "hidden"}>
        {items.flatMap(item =>
          item.choices.map(choice => (
            <div
              key={checkboxId(item, choice.value)}
              data-search-result
              hidden={!isMatch(choice.title)}
            >
              <label className="label min-h-[2.75rem] cursor-pointer justify-start gap-x-3">
                <input
                  type="checkbox"
                  className="checkbox"
                  {...register(item.id)}
                  value={choice.value}
                  id={checkboxId(item, choice.value)}
                />
                <span className="grid">
                  <span className="label-text">{choice.title}</span>
                  <span className="text-xs text-base-content/60">{item.title}</span>
                </span>
              </label>
            </div>
          )),
        )}
      </div>
      <div className="grid gap-8">
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
