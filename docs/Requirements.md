## Project Checklist

###  1. Embeddable Chat Widget *DONE*
Build a small widget that looks and behaves like something that can be embedded on a docs page.

**Minimum UI:** *DONE*
- A chat icon button in the bottom-right corner.
- Clicking it opens a chat panel.

**Implementation note:** *DONE*
- You do not need to embed it into a real external site.

Structure your code as a self-contained component (example: `<UiLibraryAssistant />`) that could be dropped into any page.

---

###  2. Chat Interface *DONE*
Must include:
- A message list (user + assistant).
- An input box and Send button.
- Loading states while waiting for a response.
- Scrollable chat history.
---

### 3. Persistent Storage *DONE*
Persist the chat history so that if the user refreshes the page, the conversation is restored.

[Used indexdb for persisting storage]
---

### 4. Streaming Behaviour
The assistant response must stream rather than appear all at once. You may implement streaming using any approach:
- A mock API that returns chunks over time. *DONE*
- Optional: SSE or WebSocket if you want.

---

### 5. UI Example Rendering
Users should be able to type queries like: *DONE*
- “Show me different types of button components”
- “Show me variations of chat bubbles”
- “Show me a primary, secondary, and ghost button”

**Expected behavior:**
- The assistant responds with content that causes the frontend to render real interactive components  
  (not screenshots, not plain text descriptions). *DONE*

---

## Direction A – Large Chat History (~1000 messages)
Design your chat so that a single conversation can grow to around 1000 messages and still feel usable and responsive.

---

## Direction B – Streamable Markdown + JSON → Components *DONE* [Also encompassess Antd, Material UI components]
Design a response format where the assistant returns a mix of:
- Markdown (for normal text), and
- Structured blocks (e.g. JSON) that the frontend turns into interactive components. 


### Example JSON response 1

```json
# Group of button
{
  "type": "button-group",
  "variants": ["primary", "secondary", "ghost"]
}
```

```json
# Good CTA button
{
  "type": "button",
  "variant": ["primary"],
  "text": "Submit"
}
```

### Example JSON response 2

```json
# Form fields
{
  "type": "ui-group",
  "components": [
    { "type": "input", "placeholder": "name" },
    { "type": "input", "placeholder": "age" },
    { "type": "button", "text": "submit" }
  ]
}
```

---

## Direction C – Bundle Splitting & Embeddable Performance *DONE*
Treat this as a real widget shipped into another app with high traffic (example: 1M visits/day):
- Think about bundle size and code splitting.
- Make sure the host page doesn’t get a huge payload for features it doesn’t use.
- Show how the widget would be built and consumed as a separate bundle.
