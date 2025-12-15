# UI Chatbot for Component Libraries

An embeddable chat widget for design systems. Users can request and preview interactive UI components through chat.

## Features

- Embeddable widget component
- Streaming responses (word-by-word)
- Interactive component rendering
- Persistent chat history (localStorage)
- Lazy-loaded components
- Error handling

## Installation

```bash
npm install
npm run dev
```


```bash
python -m venv myenv
source myenv/bin/activate
uv run uvicorn main:app --reload
```

## Usage

```tsx
import { ChatWidget } from '@/components/ChatWidget';

function App() {
  return (
    <div>
      <ChatWidget />
    </div>
  );
}
```

## Requirements

### 1. Embeddable Chat Widget
- Chat button in bottom-right corner
- Opens/closes chat panel
- Self-contained component

### 2. Chat Interface
- Message list (user and assistant)
- Input box and Send button
- Loading states
- Scrollable history with auto-scroll
- Error handling

### 3. Persistent Storage
- IndexDb for chat history
- Auto-save on message changes
- Restore on page refresh
- Clear history option

### 4. Streaming Behavior
- Word-by-word streaming via async generators
- 50ms delay between words
- Incremental UI updates
- Error handling

### 5. UI Example Rendering
- Renders interactive Button components from Material UI, Antd , etc
- Lazy-loaded components
- Example queries: "Show me button components", "Display chat bubble variations"


## Technologies

- React 18 with TypeScript
- Vite
- Tailwind CSS
- Absolute imports (@/ alias)
- React.lazy() for code splitting

## Focus Directions

### Performance & Code Splitting
- Lazy loading for UI components
- Code splitting with React.lazy()
- Suspense boundaries


## Tradeoffs

1. AI/LLM integration for gettin json structure for components
2. Indexdb instead of backend sync
3. Fixed component set for libraries


## Future Enhancements

- LLM API integration (OpenAI, Anthropic)
- More component types
- Backend chat history sync
- User authentication
- Analytics
- Component code preview

## License

MIT
