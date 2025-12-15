import React from 'react';
import ReactDOM from 'react-dom/client';

export interface WidgetConfig {
  apiUrl?: string;
  theme?: 'light' | 'dark';
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  onReady?: () => void;
  onError?: (error: Error) => void;
}

let widgetRoot: ReactDOM.Root | null = null;
let currentConfig: WidgetConfig = {};

// Lazy load the ChatWidget component - extract named export
const loadChatWidget = () => 
  import('./components/ChatWidget/index').then(m => m.ChatWidget);

const ChatWidgetDemo = {
  init: async (config: WidgetConfig = {}) => {
    try {
      // Store config for updates
      currentConfig = { ...config };

      // Create container
      let container = document.getElementById('ui-widget-root');
      if (!container) {
        container = document.createElement('div');
        container.id = 'ui-widget-root';
        document.body.appendChild(container);
      }

      // Lazy load the ChatWidget component
      const ChatWidget = await loadChatWidget();

      // Create root only once
      if (!widgetRoot) {
        widgetRoot = ReactDOM.createRoot(container);
      }

      // Render widget
      widgetRoot.render(
        <React.StrictMode>
          <ChatWidget 
            apiUrl={currentConfig.apiUrl || 'http://localhost:8000'}
            theme={currentConfig.theme || 'light'}
            position={currentConfig.position || 'bottom-right'}
          />
        </React.StrictMode>
      );

      config.onReady?.();
      return widgetRoot;
    } catch (error) {
      const err = error as Error;
      console.error('ChatWidget initialization error:', err);
      config.onError?.(err);
      throw err;
    }
  },

  destroy: () => {
    try {
      if (widgetRoot) {
        widgetRoot.unmount();
        widgetRoot = null;
      }
      const container = document.getElementById('ui-widget-root');
      if (container) {
        container.remove();
      }
      currentConfig = {};
    } catch (error) {
      console.error('ChatWidget destroy error:', error);
    }
  },

  update: async (config: Partial<WidgetConfig>) => {
    try {
      // Merge with existing config
      currentConfig = { ...currentConfig, ...config };
      
      if (widgetRoot) {
        const ChatWidget = await loadChatWidget();
        const container = document.getElementById('ui-widget-root');
        
        if (container) {
          widgetRoot.render(
            <React.StrictMode>
              <ChatWidget 
                apiUrl={currentConfig.apiUrl || 'http://localhost:8000'}
                theme={currentConfig.theme || 'light'}
                position={currentConfig.position || 'bottom-right'}
              />
            </React.StrictMode>
          );
        }
      } else {
        // Initialize if not already initialized
        await ChatWidgetDemo.init(currentConfig);
      }
    } catch (error) {
      console.error('ChatWidget update error:', error);
    }
  }
};

// Expose globally for <script> tag usage
if (typeof window !== 'undefined') {
  (window as any).ChatWidgetDemo = ChatWidgetDemo;
}

export default ChatWidgetDemo;