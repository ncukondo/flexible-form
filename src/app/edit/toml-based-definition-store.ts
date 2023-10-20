import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import type {} from "@redux-devtools/extension"; // required for devtools typing
import TOML from "@ltd/j-toml";
import { makeDerivedConnection } from "./store-utils";
import { sampleTomlDefinition } from "./sample-toml-definition";

interface TomlTextState {
  toml: string;
  targetId: string;
  setToml: (text: string) => void;
  setTargetId: (targetId: string, tomlForId?: string) => void;
}
const useTomlText = create<TomlTextState>()(
  devtools(
    persist(
      (set, get) => ({
        setToml: (toml: string) => set({ toml }),
        setTargetId: (targetId: string, tomlForId = "") => {
          if (get().targetId === targetId) return;
          set({ targetId });
          if (tomlForId) {
            set({ toml: tomlForId });
          } else if (!tomlForId) {
            set({ toml: sampleTomlDefinition }); // set sample toml if toml is empty
          }
        },
        targetId: "",
        toml: sampleTomlDefinition,
      }),
      { name: "tomlText", skipHydration: true },
    ),
  ),
);
const initUseTomlText = (
  targetId = "",
  tomlForId = "",
  tomlAsObject: null | { [key: string]: any } = null,
) => {
  const toml =
    tomlForId || (tomlAsObject !== null ? TOML.stringify(tomlAsObject, { newline: "\n" }) : "");
  useTomlText.persist.rehydrate();
  useTomlText.getState().setTargetId(targetId, toml);
};

interface TomlDerivedJsonState {
  setToml: (text: string) => void;
  jsonObject: object | null;
  json: string;
  error: string;
}
const useTomlDerivedJson = create<TomlDerivedJsonState>()(set => {
  const setToml = (text: string) => {
    try {
      const jsonObject = TOML.parse(text, 1, "\n") ?? {};
      const json = JSON.stringify(jsonObject, null, 2);
      set({ error: "", json, jsonObject });
    } catch (e) {
      set({ error: (e as any).message });
    }
  };
  return {
    setToml,
    json: "",
    jsonObject: null,
    error: "",
  };
});

makeDerivedConnection(useTomlText, useTomlDerivedJson, (source, listner) =>
  listner.setToml(source.toml),
);

export { useTomlText, initUseTomlText, useTomlDerivedJson };
