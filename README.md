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
- localStorage for chat history
- Auto-save on message changes
- Restore on page refresh
- Clear history option

### 4. Streaming Behavior
- Word-by-word streaming via async generators
- 50ms delay between words
- Incremental UI updates
- Error handling

### 5. UI Example Rendering
- Renders interactive Button components (Primary, Secondary, Ghost, Danger)
- Renders interactive ChatBubble components (User, Assistant, System)
- Lazy-loaded components
- Example queries: "Show me button components", "Display chat bubble variations"

## Architecture

```
src/
├── components/
│   ├── ChatWidget/
│   ├── ComponentRenderer/
│   └── UIComponents/
├── services/
│   ├── chatService.ts
│   └── storage.ts
└── types/
```

## Technologies

- React 19 with TypeScript
- Vite
- Tailwind CSS
- Absolute imports (@/ alias)
- React.lazy() for code splitting

## Focus Directions

### Performance & Code Splitting
- Lazy loading for UI components
- Code splitting with React.lazy()
- Suspense boundaries
- Optimized bundle size

### Developer Experience
- Absolute imports
- TypeScript strict mode
- Modular architecture
- Self-contained design

## Assumptions

1. localStorage available (modern browsers)
2. Supports Button and ChatBubble components
3. Regex pattern matching for queries (replaceable with LLM)
4. Mock streaming with setTimeout (replaceable with SSE/WebSocket)

## Tradeoffs

1. Pattern matching instead of AI/LLM integration
2. LocalStorage instead of backend sync
3. Fixed component set (extend componentMap to add more)

## Limitations

1. No backend integration (mock responses)
2. Limited component types (2 supported)
3. No authentication
4. No internationalization
5. No analytics

## Future Enhancements

- LLM API integration (OpenAI, Anthropic)
- More component types
- Backend chat history sync
- User authentication
- Analytics
- Internationalization
- Dark mode
- Component code preview

## Production Considerations

- Error handling: Implemented
- Type safety: TypeScript strict mode
- Performance: Lazy loading and code splitting
- Accessibility: Needs ARIA labels and keyboard navigation
- Testing: Needs unit and integration tests
- Monitoring: Needs error tracking
- Security: Needs input sanitization

## License

MIT
