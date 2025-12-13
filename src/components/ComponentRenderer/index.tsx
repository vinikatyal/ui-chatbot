import React from 'react';
import type { ComponentData } from '../../types';
import { Button, ChatBubble } from '../UIComponents';

interface ComponentRendererProps {
  components: ComponentData[];
}

const componentMap = {
  button: Button,
  chatBubble: ChatBubble,
};

export const ComponentRenderer: React.FC<ComponentRendererProps> = ({ components }) => {
  return (
    <div className="mt-4 space-y-3 p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
      {components.map((comp) => {
        const Component = componentMap[comp.type];
        if (!Component) return null;
        
        return (
          <div key={comp.id} className="p-2 bg-white rounded shadow-sm">
            <Component {...comp.props} />
          </div>
        );
      })}
    </div>
  );
};