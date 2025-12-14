import React, { Suspense, lazy } from 'react';
import type { ComponentRendererProps } from '@/types/interfaces';

// Lazy load components
const Button = lazy(() => import('@/components/UIComponents/Button').then(module => ({ default: module.Button })));
const ChatBubble = lazy(() => import('@/components/UIComponents/ChatBubble').then(module => ({ default: module.ChatBubble })));
const Input = lazy(() => import('@/components/UIComponents/Input').then(module => ({ default: module.Input })));

// this needs to be automated with AI 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const componentMap: Record<string, React.LazyExoticComponent<React.ComponentType<any>>> = {
    button: Button,
    chatBubble: ChatBubble,
    input: Input,
};

const LoadingFallback = () => (
    <div className="p-2 bg-white rounded shadow-sm animate-pulse">
        <div className="h-8 bg-gray-200 rounded"></div>
    </div>
);

export const ComponentRenderer: React.FC<ComponentRendererProps> = ({ components }) => {
    return (
        <div className="mt-4 space-y-3 p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
            {components.map((comp) => {
                const Component = componentMap[comp.type];
                if (!Component) return null;

                return (
                    <div key={comp.id} className="p-2 bg-white rounded shadow-sm">
                        <Suspense fallback={<LoadingFallback />}>
                            <Component {...comp.props} />
                        </Suspense>
                    </div>
                );
            })}
        </div>
    );
};