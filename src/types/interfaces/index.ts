import type { Message } from '@/types';
import { type ComponentData } from '@/types';

// chat interfaces

export interface ChatMessageProps {
    message: Message;
}


// component interfaces
export interface ComponentRendererProps {
    components: ComponentData[];
}