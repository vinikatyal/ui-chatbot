export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
    components?: ComponentData[];
    isStreaming?: boolean;
  }
  
  export interface ComponentData {
    type: 'button' | 'chatBubble' | 'card';
    props: Record<string, any>;
    id: string;
  }
  
  export interface ChatState {
    messages: Message[];
    isOpen: boolean;
  }