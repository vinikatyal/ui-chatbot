import { ChatWidget } from '@/components/ChatWidget';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Demo Documentation Page */}
      <div className="max-w-4xl mx-auto p-8">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Component Library Documentation
          </h1>
          <p className="text-lg text-gray-600">
            Example documentation page with embedded UI chatbot assistant
          </p>
        </header>

        <section className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
          <p className="text-gray-700 mb-4">
            Welcome to our component library. Use the chat assistant in the bottom-right 
            corner to explore and preview components interactively.
          </p>
        </section>

        <section className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold mb-4">Components</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• Buttons (Primary, Secondary, Ghost, Danger)</li>
            <li>• Chat Bubbles (User, Assistant, System)</li>
            <li>• Input Fields</li>
            <li>• Cards & Containers</li>
          </ul>
        </section>
      </div>

      {/* My Chat Widget */}
      <ChatWidget />
    </div>
  );
}

export default App;