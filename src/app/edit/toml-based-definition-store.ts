import { create, createStore } from "zustand";
import { persist, devtools } from "zustand/middleware";
import type {} from "@redux-devtools/extension"; // required for devtools typing
import TOML from "@ltd/j-toml";
import { makeDerivedConnection } from "./store-utils";
import { sampleTomlDefinition } from "./sample-toml-definition";

const tomlTextDictKey = "toml-text-dict";
interface TomlTextDictState {
  tomlDict: { [key: string]: string };
  targetId: string;
  currentInitialToml: string;
  setTargetId: (targetId: string) => void;
  setCurrentInitialToml: (toml: string | { [key: string]: any }) => void;
  reset: () => void;
  setToml: (toml: string) => void;
  getToml: () => string;
}
const keyPrefix = "toml-text-";

const useTomlTextDict = create<TomlTextDictState>()(
  devtools(
    persist(
      (set, get) => {
        const key = () => keyPrefix + get().targetId;
        return {
          setTargetId: (targetId: string) => set({ targetId }),
          setCurrentInitialToml: (toml: string | { [key: string]: any }) => {
            const currentInitialToml =
              typeof toml === "string" ? toml : TOML.stringify(toml, { newline: "\n" });
            set({ currentInitialToml });
          },
          getToml: () => {
            const tomlDict = get().tomlDict;
            return Object.hasOwn(tomlDict, key()) ? tomlDict[key()] : get().currentInitialToml;
          },
          setToml: (toml: string) => {
            const tomlDict = get().tomlDict;
            set({ tomlDict: { ...tomlDict, [key()]: toml } });
          },
          reset: () => {
            const tomlDict = get().tomlDict;
            delete tomlDict[key()];
            set({ tomlDict });
          },
          currentInitialToml: "",
          targetId: "",
          tomlDict: {},
        };
      },
      {
        name: tomlTextDictKey,
        skipHydration: true,
        partialize: state => ({ tomlDict: state.tomlDict }),
      },
    ),
  ),
);
const initTomlTextDict = (
  targetId: string,
  inititialTomlForId: string | { [key: string]: any },
) => {
  useTomlTextDict.persist.rehydrate();
  useTomlTextDict.getState().setTargetId(targetId);
  useTomlTextDict.getState().setCurrentInitialToml(inititialTomlForId);
};

const resetTomlTextDict = (
  targetId: string,
  inititialTomlForId: string | { [key: string]: any },
) => {
  useTomlTextDict.getState().reset();
  useTomlTextDict.getState().setTargetId(targetId);
  useTomlTextDict.getState().setCurrentInitialToml(inititialTomlForId);
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

makeDerivedConnection(useTomlTextDict, useTomlDerivedJson, (source, listner) =>
  listner.setToml(source.getToml()),
);

export {
  useTomlTextDict as useTomlText,
  initTomlTextDict as initTomlText,
  resetTomlTextDict as resetTomlText,
  useTomlDerivedJson,
};
