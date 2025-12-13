# UI Chatbot for Component Libraries

An embeddable chat widget that acts as a "UI librarian" for design systems. Users can chat with the assistant to request and preview interactive UI components in real-time.

## Features

- 🎨 **Embeddable Widget**: Self-contained component that can be dropped into any documentation site
- 💬 **Streaming Responses**: Word-by-word streaming for natural conversation flow
- 🎯 **Interactive Components**: Renders live, interactive UI components (not just text)
- 💾 **Persistent Storage**: Chat history persists across page refreshes
- ⚡ **Lazy Loading**: Components are code-split and loaded on-demand
- 🎭 **Smooth Animations**: Polished UI with slide-up and fade-in animations

## How to Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Usage

Simply import and use the `ChatWidget` component in your documentation site:

```tsx
import { ChatWidget } from '@/components/ChatWidget';

function App() {
  return (
    <div>
      {/* Your documentation content */}
      <ChatWidget />
    </div>
  );
}
```

## Baseline Requirements Checklist

### ✅ 1. Embeddable Chat Widget
- Chat icon button in bottom-right corner
- Opens/closes chat panel on click
- Self-contained component (`<ChatWidget />`)
- Can be embedded in any page

### ✅ 2. Chat Interface
- Message list displaying user and assistant messages
- Input box with Send button
- Loading states with animated indicators
- Scrollable chat history with auto-scroll
- Error handling with user-friendly messages

### ✅ 3. Persistent Storage
- Uses `localStorage` to persist chat history
- Automatically saves messages on state changes
- Restores conversation on page refresh
- Clear history functionality

### ✅ 4. Streaming Behavior
- Implements word-by-word streaming using async generators
- 50ms delay between words for natural flow
- Updates UI incrementally as chunks arrive
- Handles streaming errors gracefully

### ✅ 5. UI Example Rendering
- Renders interactive Button components (Primary, Secondary, Ghost, Danger)
- Renders interactive ChatBubble components (User, Assistant, System)
- Components are lazy-loaded for optimal performance
- Supports queries like:
  - "Show me button components"
  - "Display chat bubble variations"
  - "Show me different types of buttons"

## Architecture

### Component Structure
```
src/
├── components/
│   ├── ChatWidget/          # Main embeddable widget
│   │   ├── index.tsx        # Main widget component
│   │   ├── ChatMessage.tsx  # Individual message display
│   │   ├── ChatInput.tsx    # Input component
│   │   └── style.css        # Widget styles
│   ├── ComponentRenderer/   # Renders UI components from chat
│   └── UIComponents/         # Interactive UI components
│       ├── Button.tsx
│       └── ChatBubble.tsx
├── services/
│   ├── chatService.ts       # Streaming response service
│   └── storage.ts           # LocalStorage persistence
└── types/
    ├── index.tsx            # Core types
    └── interfaces/          # Component interfaces
```

### Key Technologies
- **React 19** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Absolute imports** with `@/` alias
- **Lazy loading** with React.lazy() and Suspense

## Focus Directions

### Direction A: Performance & Code Splitting
- ✅ Implemented lazy loading for UI components
- ✅ Code splitting with React.lazy()
- ✅ Suspense boundaries with loading fallbacks
- ✅ Optimized bundle size

### Direction B: Developer Experience
- ✅ Absolute imports for cleaner code
- ✅ TypeScript with strict type checking
- ✅ Modular component architecture
- ✅ Self-contained, embeddable design

## Assumptions, Tradeoffs & Limitations

### Assumptions
1. **LocalStorage Availability**: Assumes localStorage is available (modern browsers)
2. **Component Library**: Currently supports Button and ChatBubble components
3. **Pattern Matching**: Uses regex patterns to match user queries (can be replaced with AI/LLM)
4. **Mock Streaming**: Uses setTimeout for streaming simulation (can be replaced with real SSE/WebSocket)

### Tradeoffs
1. **Pattern Matching vs AI**: Currently uses simple regex patterns. For production, integrate with an LLM API (OpenAI, Anthropic, etc.)
2. **LocalStorage vs Backend**: Chat history is stored locally. For multi-device sync, use a backend API
3. **Fixed Component Set**: Only Button and ChatBubble are supported. Extend `componentMap` to add more

### Limitations
1. **No Backend Integration**: Currently uses mock responses. Real implementation would need API integration
2. **Limited Component Types**: Only 2 component types supported (easily extensible)
3. **No Authentication**: No user management or session handling
4. **Single Language**: No internationalization support
5. **No Analytics**: No tracking of user interactions

## Future Enhancements

- [ ] Integrate with LLM API (OpenAI, Anthropic) for intelligent responses
- [ ] Add more component types (Cards, Inputs, Modals, etc.)
- [ ] Backend integration for chat history sync
- [ ] User authentication and session management
- [ ] Analytics and usage tracking
- [ ] Internationalization (i18n)
- [ ] Dark mode support
- [ ] Customizable themes
- [ ] Component code preview
- [ ] Copy-to-clipboard functionality

## Production-Grade Considerations

For a production deployment, consider:

1. **Error Handling**: ✅ Implemented error states and user feedback
2. **Type Safety**: ✅ Full TypeScript with strict mode
3. **Performance**: ✅ Lazy loading and code splitting
4. **Accessibility**: ⚠️ Add ARIA labels and keyboard navigation
5. **Testing**: ⚠️ Add unit and integration tests
6. **Monitoring**: ⚠️ Add error tracking (Sentry, etc.)
7. **Documentation**: ✅ Comprehensive README
8. **Security**: ⚠️ Sanitize user inputs and component props

## License

MIT
