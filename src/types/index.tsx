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
    library: string;
    type: 'button' | 'chatbubble' | 'card' | 'input' | 'textfield' | 'chip' | 'switch' | 'tag';
    props: Record<string, unknown>;
    id: string;
  }
  
  export interface ChatState {
    messages: Message[];
    isOpen: boolean;
  }