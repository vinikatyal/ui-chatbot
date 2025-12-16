import React, { useEffect, useRef } from "react";
import type { ChatMessageProps } from "@/types/interfaces";
import { ComponentRenderer } from "@/components/ComponentRenderer";
import MarkDownRenderer from "@/components/MarkDownRenderer";
import { stripJsonCodeBlocks } from "@/utils/index";

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
    const isUser = message.role === "user";
    const messageRef = useRef<HTMLDivElement>()

    useEffect(() => {
        if (!message.isStreaming) {
            messageRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [message.isStreaming]);

    const displayText = isUser
        ? message.content
        : stripJsonCodeBlocks(message.content);

    console.log("Display Text", displayText)

    return (
        <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
            <div className="max-w-[85%]">
                <div
                    className={`rounded-2xl px-4 py-2 ${isUser ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
                        }`}
                >
                    {isUser || message.isStreaming ? (
                        <p className="text-sm whitespace-pre-wrap break-words">
                            {displayText}
                        </p>
                    ) : (
                        <div className="prose max-w-none text-sm">
                            <MarkDownRenderer markDownString={displayText} />
                        </div>
                    )}
                </div>

                {message.components?.length ? (
                    <ComponentRenderer components={message.components} />
                ) : null}
            </div>
        </div>
    );
};
