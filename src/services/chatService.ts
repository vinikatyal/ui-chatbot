import { type ComponentData } from '@/types';

// This component is being rendered based on my text we can use AI Layer in this 
const componentPatterns = {
  button: /button/i,
  chatBubble: /chat bubble|message bubble|chat layout/i,
};

const responses: Record<string, { text: string; components: ComponentData[] }> = {
  button: {
    text: "Here are different button variations for your component library:",
    components: [
      { type: 'button', props: { variant: 'primary', children: 'Primary Button' }, id: 'btn-1' },
      { type: 'button', props: { variant: 'secondary', children: 'Secondary Button' }, id: 'btn-2' },
      { type: 'button', props: { variant: 'ghost', children: 'Ghost Button' }, id: 'btn-3' },
      { type: 'button', props: { variant: 'danger', children: 'Danger Button' }, id: 'btn-4' },
    ]
  },
  chatBubble: {
    text: "Here are different chat bubble styles you can use:",
    components: [
      { type: 'chatBubble', props: { variant: 'user', message: 'This is a user message' }, id: 'cb-1' },
      { type: 'chatBubble', props: { variant: 'assistant', message: 'This is an assistant message' }, id: 'cb-2' },
      { type: 'chatBubble', props: { variant: 'system', message: 'This is a system message' }, id: 'cb-3' },
    ]
  }
};

export class ChatService {
  async *streamResponse(userMessage: string): AsyncGenerator<{ content: string; components?: ComponentData[] }> {
    // Determine response type
    let response = { 
      text: "I can show you various UI components. Try asking about buttons, chat bubbles, or other components!",
      components: [] as ComponentData[]
    };

    for (const [key, pattern] of Object.entries(componentPatterns)) {
      if (pattern.test(userMessage)) {
        response = responses[key];
        break;
      }
    }

    // Stream the text response
    const words = response.text.split(' ');
    let accumulated = '';

    for (const word of words) {
      accumulated += (accumulated ? ' ' : '') + word;
      await new Promise(resolve => setTimeout(resolve, 50));
      yield { content: accumulated };
    }

    // Yield components after text
    if (response.components.length > 0) {
      yield { content: accumulated, components: response.components };
    }
  }
}

export const chatService = new ChatService();