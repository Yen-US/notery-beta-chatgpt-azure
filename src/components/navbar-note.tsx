'use client'
import NavBar from "@/components/navbar";
import NavBarMobile from "@/components/navbar-mobile";
import Note from "@/components/messages";
import { Session } from "next-auth";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";


export default function NavbarNoteParentComponent({session} : {session: Session | null}) {
    const  [model, setModel] = useState<string>("gpt-4o-mini")
    const [size, setSize] = useState<string>("1024x1024")
    const [visible, setVisible] = useState(false);

    useEffect(() => {
      const checkScroll = () => {
        if (!visible && window.scrollY > 100) {
          setVisible(true);
        } else if (visible && window.scrollY <= 100) {
          setVisible(false);
        }
      };
    
      window.addEventListener("scroll", checkScroll);
      return () => window.removeEventListener("scroll", checkScroll);
    }, [visible]);
    
    const backToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    }

  return (
    <div>
      <NavBar className="sm:flex items-center justify-around p-6 hidden" model={model} setModel={setModel} size={size} setSize={setSize} session={session} />
      <NavBarMobile className="flex items-center justify-around p-6 sm:hidden" model={model} setModel={setModel} size={size} setSize={setSize} session={session} />
      <div className="m-10">
      <Note model={model} session={session} size={size}/>
      </div>
      
      <Button size='sm' className={`bottom-6 right-6 ${visible ? 'opacity-1' : 'opacity-0' } fixed transition-all text-sm ml-2`} onClick={backToTop}>Top</Button>
      
    </div>
  );
}
