import React, { useEffect, useRef, useState, useCallback } from "react";
import type { Message, ChatState } from "@/types";
import { ChatMessage } from "@/components/ChatWidget/ChatMessage";
import { ChatInput } from "@/components/ChatWidget/ChatInput";
import { ChatService } from "@/services/chatService";
import { storage } from "@/services/storage";
import "@/components/ChatWidget/style.css";

interface ChatWidgetProps {
  apiUrl?: string;
  theme?: 'light' | 'dark';
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

const POSITION_CLASSES = {
  'bottom-right': 'bottom-6 right-6',
  'bottom-left': 'bottom-6 left-6',
  'top-right': 'top-6 right-6',
  'top-left': 'top-6 left-6',
};

const CHAT_POSITION_CLASSES = {
  'bottom-right': 'bottom-24 right-6',
  'bottom-left': 'bottom-24 left-6',
  'top-right': 'top-24 right-6',
  'top-left': 'top-24 left-6',
};

export const ChatWidget: React.FC<ChatWidgetProps> = ({
  apiUrl = "http://localhost:8000",
  theme = 'light',
  position = 'bottom-right'
}) => {
  const [state, setState] = useState<ChatState>({ messages: [], isOpen: false });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [chatService] = useState(() => new ChatService({
    apiUrl,
    onError: (error) => console.error('Chat error:', error)
  }));

  const seqRef = useRef<number>(1);
  const messagesRef = useRef<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Keep ref synced
  useEffect(() => {
    messagesRef.current = state.messages;
  }, [state.messages]);

  // Load from IndexedDB once
  useEffect(() => {
    (async () => {
      const saved = await storage.load();
      if (saved?.length) {
        const sorted = [...saved].sort((a, b) => (a.seq ?? 0) - (b.seq ?? 0));
        setState(prev => ({ ...prev, messages: sorted }));

        const maxSeq = sorted.reduce((m, msg) => Math.max(m, msg.seq ?? 0), 0);
        seqRef.current = maxSeq + 1;
      }
    })();
  }, []);


  // Scroll only when a new message is added 
  useEffect(() => {
    if (!state.isOpen) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [state.messages.length, state.isOpen]);

  const handleSend = useCallback(async (content: string) => {
    if (isLoading) return;

    const text = content.trim();
    if (!text) return;

    setError(null);
    setIsLoading(true);

    const now = Date.now();
    const userId = crypto.randomUUID();
    const assistantId = crypto.randomUUID();

    const userSeq = seqRef.current++;
    const assistantSeq = seqRef.current++;

    const userMessage: Message = {
      id: userId,
      role: "user",
      content: text,
      timestamp: now,
      seq: userSeq
    };

    const assistantMessage: Message = {
      id: assistantId,
      role: "assistant",
      content: "",
      timestamp: now,
      isStreaming: true,
      seq: assistantSeq
    };

    // Append BOTH in one update to guarantee order
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage, assistantMessage],
    }));

    const allMessages = [...messagesRef.current, userMessage];

    try {
      for await (const chunk of chatService.streamResponse(allMessages)) {
        setState((prev) => ({
          ...prev,
          messages: prev.messages.map((m) =>
            m.id === assistantId
              ? {
                ...m,
                content: chunk.content,
                components: chunk.components ?? m.components,
              }
              : m
          ),
        }));
      }
    } catch (e) {
      console.error("Stream error:", e);
      setError("There was an issue, try requesting again");

      setState((prev) => ({
        ...prev,
        messages: prev.messages.filter((m) => m.id !== assistantId),
      }));
    } finally {
      setIsLoading(false);

      // Streaming done
      setState((prev) => ({
        ...prev,
        messages: prev.messages.map((m) =>
          m.id === assistantId ? { ...m, isStreaming: false } : m
        ),
      }));

      setTimeout(() => {
        storage.save(messagesRef.current).catch((err) => {
          console.error("Failed to save messages:", err);
        });
      }, 0);
    }
  }, [isLoading, chatService]);

  const toggleChat = () => setState((prev) => ({ ...prev, isOpen: !prev.isOpen }));

  const handleClearHistory = async () => {
    if (confirm("Clear chat history?")) {
      await storage.clear();
      setState((prev) => ({ ...prev, messages: [] }));
      messagesRef.current = [];
      seqRef.current = 1;
    }
  };

  const isDark = theme === 'dark';
  const buttonPosition = POSITION_CLASSES[position];
  const chatPosition = CHAT_POSITION_CLASSES[position];

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={toggleChat}
        className={`fixed ${buttonPosition} w-14 h-14 ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-blue-600 hover:bg-blue-700'
          } text-white rounded-full shadow-lg transition-all hover:scale-110 z-50 flex items-center justify-center`}
        aria-label="Toggle chat"
      >
        {state.isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {state.isOpen && (
        <div className={`fixed ${chatPosition} w-96 h-[550px] ${isDark ? 'bg-gray-900' : 'bg-white'
          } rounded-2xl shadow-2xl flex flex-col z-50 animate-slide-up`}>

          {/* Header */}
          <div className={`${isDark
              ? 'bg-gradient-to-r from-gray-800 to-gray-700'
              : 'bg-gradient-to-r from-blue-600 to-blue-700'
            } text-white p-4 rounded-t-2xl flex justify-between items-center`}>
            <div>
              <h3 className="font-semibold text-lg">UI Library Assistant</h3>
              <p className={`text-xs ${isDark ? 'text-gray-300' : 'text-blue-100'}`}>
                Ask about components
              </p>
            </div>

            <button
              onClick={handleClearHistory}
              className={`text-white ${isDark ? 'hover:bg-gray-600' : 'hover:bg-blue-500'
                } p-2 rounded`}
              title="Clear history"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className={`flex-1 overflow-y-auto p-4 ${isDark ? 'bg-gray-800' : 'bg-gray-50'
            }`}>
            {state.messages.length === 0 ? (
              <div className={`text-center ${isDark ? 'text-gray-400' : 'text-gray-500'
                } mt-8`}>
                <p className="mb-4">Welcome to UI Library Assistant</p>
                <p className="text-sm">Try asking:</p>
                <ul className="text-sm mt-2 space-y-1">
                  <li>"Show me button components"</li>
                  <li>"Display chat bubble variations"</li>
                </ul>
              </div>
            ) : (
              state.messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))
            )}

            {isLoading && (
              <div className={`flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-gray-500'
                } text-sm mt-2`}>
                <div className="animate-bounce">●</div>
                <div className="animate-bounce delay-100">●</div>
                <div className="animate-bounce delay-200">●</div>
              </div>
            )}

            {error && (
              <div className={`${isDark
                  ? 'bg-red-900 border-red-700 text-red-200'
                  : 'bg-red-50 border-red-200 text-red-700'
                } border px-4 py-2 rounded-lg text-sm mt-2`}>
                {error}
                <button
                  onClick={() => setError(null)}
                  className={`ml-2 ${isDark ? 'text-red-300 hover:text-red-100' : 'text-red-500 hover:text-red-700'
                    }`}
                >
                  ×
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <ChatInput onSend={handleSend} disabled={isLoading} />
        </div>
      )}
    </>
  );
};