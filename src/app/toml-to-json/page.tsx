'use client'
import { useEffect } from "react";
import { useTomlText } from "./store";

type EditConfigProps = JSX.IntrinsicElements["textarea"];
function EditConfig(props:EditConfigProps){
  const {toml,setToml} = useTomlText(s=>({toml:s.toml,setToml:s.setToml}));
  useEffect(()=>{
    console.log("rehydrate")
    useTomlText.persist.rehydrate();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[useTomlText])
  return (
    <div className="h-full w-full">
    <textarea className="h-full w-full textarea font-mono" {...props} value={toml} onChange={e=>setToml?.(e.target.value)}/>
    </div>
  )
}

export default function EditForm() {
  const {json,error} = useTomlText(s=>({json:s.json,error:s.error}));
  return (
    <main className="min-h-[100dvh] grid-cols-[repeat(auto-fit,minmax(300px,1fr))] grid">
      <div className="bg-yellow-100 w-full h-full relative p-2 min-h-[50dvh]">
        <EditConfig value="aaa"/> 
      {error && 
        <div className="alert alert-error shadow-lg z-10 absolute bottom-2 m-4 w-[calc(100%-4rem)]">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {error}
        </div>
        }
</div>
      <div className="bg-red-100 w-full h-full p-2  max-h-[100dvh]">
        <div className="mockup-code p-2 pb-10  h-full"><pre className="h-full overflow-auto">{"\n"+json}</pre></div> 
      </div>
    </main>
  
  )
}