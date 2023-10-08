import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware'
import type { } from '@redux-devtools/extension' // required for devtools typing
import TOML from "@ltd/j-toml";
import { makeDerivedConnection } from './store-utils';

interface TomlTextState {
  toml: string;
  setToml: (text: string) => void;
}
const useTomlText = create<TomlTextState>()(
  devtools(
    persist(
      set => ({
        setToml: (toml: string) => set({ toml }),
        toml: ""
      }),
      { name: "tomlText", skipHydration: true }
    )
  )
)
const initUseTomlText = () => useTomlText.persist.rehydrate();

interface TomlDerivedJsonState {
  setToml: (text: string) => void;
  jsonObject: object | null;
  json: string;
  error: string;
}
const useTomlDerivedJson = create<TomlDerivedJsonState>()((set) => {
  const setToml = (text: string) => {
    try {
      const jsonObject = TOML.parse(text, 1, "\n") ?? {};
      const json = JSON.stringify(jsonObject, null, 2);
      set({ error: "", json, jsonObject })
    } catch (e) {
      set({ error: (e as any).message })
    }
  }
  return {
    setToml, json: "", jsonObject: null, error: ""
  }
})

makeDerivedConnection(useTomlText, useTomlDerivedJson, (source, listner) => listner.setToml(source.toml));

export { useTomlText, initUseTomlText, useTomlDerivedJson }