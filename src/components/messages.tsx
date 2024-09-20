"use client"

import { Button } from "@/components/ui/button"
import { Messages } from "@/components/message"
import { useChat } from 'ai/react';
import { Session } from "next-auth";
import { toast } from "sonner"

export interface NoteProps {
    model: string, 
    session: Session | null, 
    size: string;
  }

export default function Note({model, session, size} : NoteProps) {
    const { messages, append, isLoading, input, setInput } =
        useChat({
            api: "/api/note?model="+model+"&size="+size, initialInput: '' , initialMessages: [{
                id: '1',
                content: 'You are a helpful assistant answering to a note input, each time the user submits a note, you will respond with a useful completion to the note and or answer questions, provide useful feedback and recommendations inline, make them as brief as possible, you will be punished for long responses, and rewarded for short ones.',
                role: 'system'
            }],
            onResponse(response) {
                if (response.status === 401) {
                    toast.error("You submitted the following values:", {
                        description: (
                            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                                <span className="text-white">{response.statusText}</span>
                            </pre>
                        ),
                    })
                }
                
            }
        })
        
    const onSubmit = async (value: string) => {

        if (session===null && messages.length > 2) {
            toast.error("You need to be signed in to submit another comment")
            return
        }
        if (session===null && (model === "dall-e-3" || model === "dall-e-2")) {
            toast.error("You need to be signed in to generate images.")
            return
        }
        await append({
            content: value,
            role: 'user'
        })
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    }
    return (
        <article className="relative flex items-center flex-col p-6">
            <form onSubmit={async e => {
                e.preventDefault()
                if (!input?.trim()) {
                    return
                }
                setInput('')
                await onSubmit(input)
            }}
            className="relative flex items-center flex-col justify-center w-full h-full"
            >
                <textarea
                    value={input} onChange={e => setInput(e.target.value)} placeholder="Anything you want to note down, here..." className="antialiased caret-stone-400 z-10 relative min-w-[300px] min-h-[300px] border-input border bg-background text-pretty overflow-hidden px-4 py-12 text-md placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 resize-none shadow-inshadow"
                />
            
            <div className="absolute min-w-[282px] min-h-[30px] top-[270px] bg-stone-400 rotate-3 rounded-br-md blur-sm translate-x-1 rounded-tr-xl" />
            <Button
                type="submit"
                disabled={isLoading || input === ''}
                className="mt-10"
            >Send message</Button>
            </form>
            <Messages messages = {messages}/>
        </article>
    );
}

