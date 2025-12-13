import React from 'react';

interface ChatBubbleProps {
  variant: 'user' | 'assistant' | 'system';
  message: string;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ variant, message }) => {
  const baseStyles = 'max-w-[80%] p-3 rounded-2xl mb-2 shadow-sm';
  
  const variantStyles = {
    user: 'bg-blue-600 text-white ml-auto rounded-br-none',
    assistant: 'bg-gray-200 text-gray-800 mr-auto rounded-bl-none',
    system: 'bg-yellow-100 text-yellow-900 mx-auto text-center text-sm'
  };

  return (
    <div className={`${baseStyles} ${variantStyles[variant]}`}>
      {message}
    </div>
  );
};