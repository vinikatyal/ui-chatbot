import React, { useState, useEffect, useRef } from 'react';
import type { Message, ChatState } from '@/types';
import { ChatMessage } from '@/components/ChatWidget/ChatMessage';
import { ChatInput } from '@/components/ChatWidget/ChatInput';
import { chatService } from '@/services/chatService';
import { storage } from '@/services/storage';
import '@/components/ChatWidget/style.css';

export const ChatWidget: React.FC = () => {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isOpen: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedMessages = storage.load();
    if (savedMessages.length > 0) {
      setState(prev => ({ ...prev, messages: savedMessages }));
    }
  }, []);

  useEffect(() => {
    if (state.messages.length > 0) {
      storage.save(state.messages);
    }
  }, [state.messages]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.messages, isLoading]);

  const handleSend = async (content: string) => {
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: Date.now()
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage]
    }));

    setIsLoading(true);

    const assistantMessage: Message = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      isStreaming: true
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, assistantMessage]
    }));

    try {
      setError(null);
      for await (const chunk of chatService.streamResponse(content)) {
        setState(prev => ({
          ...prev,
          messages: prev.messages.map(msg =>
            msg.id === assistantMessage.id
              ? { ...msg, content: chunk.content, components: chunk.components, isStreaming: !chunk.components }
              : msg
          )
        }));
      }
    } catch (error) {
      console.error('Stream error:', error);
      setError('Failed to get response. Please try again.');
      // Remove the failed assistant message
      setState(prev => ({
        ...prev,
        messages: prev.messages.filter(msg => msg.id !== assistantMessage.id)
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => {
    setState(prev => ({ ...prev, isOpen: !prev.isOpen }));
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all hover:scale-110 z-50 flex items-center justify-center"
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

      {/* Chat Panel */}
      {state.isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[550px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 animate-slide-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-2xl flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-lg">UI Library Assistant</h3>
              <p className="text-xs text-blue-100">Ask about components</p>
            </div>
            <button
              onClick={() => {
                if (confirm('Clear chat history?')) {
                  storage.clear();
                  setState(prev => ({ ...prev, messages: [] }));
                }
              }}
              className="text-white hover:bg-blue-500 p-2 rounded"
              title="Clear history"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {state.messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <p className="mb-4">Welcome to UI Library Assistant</p>
                <p className="text-sm">Try asking:</p>
                <ul className="text-sm mt-2 space-y-1">
                  <li>"Show me button components"</li>
                  <li>"Display chat bubble variations"</li>
                </ul>
              </div>
            ) : (
              state.messages.map(message => (
                <ChatMessage key={message.id} message={message} />
              ))
            )}
            {isLoading && (
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <div className="animate-bounce">●</div>
                <div className="animate-bounce delay-100">●</div>
                <div className="animate-bounce delay-200">●</div>
              </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
                {error}
                <button
                  onClick={() => setError(null)}
                  className="ml-2 text-red-500 hover:text-red-700"
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