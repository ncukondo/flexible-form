import { create } from 'zustand';
import type { StateCreator } from 'zustand';
import { persist, devtools } from 'zustand/middleware'
import type { } from '@redux-devtools/extension' // required for devtools typing
import TOML from "@ltd/j-toml";

interface TomlTextState {
  toml: string;
  setToml: (text: string) => void;
  jsonObject: object;
  json: string;
  error: string;
}
const tomlTextSlice:StateCreator<TomlTextState> = (set)=>{
  const setToml = (text:string)=>{
    set({ toml: text });
    try {
      const jsonObject = TOML.parse(text, 1, "\n") ?? {};
      const json = JSON.stringify(jsonObject, null, 2);
      set({ error: "", json, jsonObject })
    } catch (e) {
      set({ error: (e as any).message })
    }
  }
  return {
    setToml,toml:"",json:"",jsonObject:{},error:""
  }

}

const useTomlText = create<TomlTextState>()(
  devtools(
    persist(
      (...args)=>({...tomlTextSlice(...args)}),
      {
        name: "TomlTextState",
        skipHydration:true,
        partialize:(state)=>({toml:state.toml}),
      }
    )
  )
)


export { useTomlText }