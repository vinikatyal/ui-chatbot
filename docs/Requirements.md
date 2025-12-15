- 1. Embeddable Chat Widget
Build a small widget that looks and behaves like something that can be embedded on a docs page.
Minimum UI:
A chat icon button in the bottom-right corner.
Clicking it opens a chat panel.


Implementation note:
You do not need to embed it into a real external site.


Structure your code as a self-contained component (example: <UiLibraryAssistant />) that could be dropped into any page.


- 2. Chat Interface
Must include:
A message list (user + assistant).


An input box and Send button.


Loading states while waiting for a response.


Scrollable chat history.


- 3. Persistent storage 
Persist the chat history so that if the user refreshes the page, the conversation is restored.


- 4. Streaming Behaviour
The assistant response must stream rather than appear all at once. You may implement streaming using any approach:
A mock API that returns chunks over time.


Optional: SSE or WebSocket if you want.

- 5. UI Example Rendering
Users should be able to type queries like:
“Show me different types of button components”


“Show me variations of chat bubbles”


“Show me a primary, secondary, and ghost button”


Expected behavior:
The assistant responds with content that causes the frontend to render real interactive components (not screenshots, not plain text descriptions).

