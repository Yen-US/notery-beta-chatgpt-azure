import { MemoizedReactMarkdown } from "./markdown"
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { CodeBlock } from "@/components/ui/codeblock"
import { Message } from 'ai'
import { Separator } from "./ui/separator"


export function Messages( { messages} : { messages: Message[]} ) {
    return <div className="relative mx-auto max-w-2xl px-4 mt-10">
        {messages.map((message, index) => (
            <div key={index}>
                {message.role === 'system' ? '' :
                <div className="flex-1 px-1 ml-4 space-y-2 overflow-hidden">
                    <MemoizedReactMarkdown
                        className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
                        remarkPlugins={[remarkGfm, remarkMath]}
                        components={{
                            p({ children }) {
                                return <p className="mb-2 last:mb-0">{children}</p>
                            },
                            code({ node, className, children, ...props }) {
                                if (children && typeof children === 'string') {
                                    if (children.length) {
                                        if (children[0] == '▍') {
                                            return (
                                                <span className="mt-1 cursor-default animate-pulse">▍</span>
                                            )
                                        }
                                        children = children.replace('`▍`', '▍')
                                    }
                                }
                                const match = /language-(\w+)/.exec(className || '')

                                return (
                                    <CodeBlock
                                        key={Math.random()}
                                        language={(match && match[1]) || ''}
                                        value={String(children).replace(/\n$/, '')}
                                        {...props} />
                                )
                            }
                        }}
                    >
                        {message.content}
                    </MemoizedReactMarkdown>
                </div>
                }
                {index < messages.length - 1 &&  message.role !== 'system' && (
                    <Separator className="my-4"/>
                )}
            </div>
        ))}
    </div>
}
