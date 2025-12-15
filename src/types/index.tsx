export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
    seq: number;
    components?: ComponentData[];
    isStreaming?: boolean;
  }
  
  export interface ComponentData {
    type: 'button' | 'chatBubble' | 'card' | 'input';
    props: Record<string, unknown>;
    id: string;
  }
  
  export interface ChatState {
    messages: Message[];
    isOpen: boolean;
  }