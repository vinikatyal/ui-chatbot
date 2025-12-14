from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from starlette.responses import StreamingResponse
from typing import List
from openai import OpenAI
import logging
import json
import uvicorn
import asyncio

logging.basicConfig(level=logging.DEBUG)  # Set to DEBUG to see detailed logs

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins like ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    role: str
    content: str

class InferenceRequest(BaseModel):
    messages: List[Message]
    stream: bool

client = OpenAI(api_key='')  # Replace with your actual OpenAI API key

# System prompt for the UI Library Assistant
SYSTEM_PROMPT = """You are a UI Component Assistant that helps users explore and understand UI components through interactive demonstrations embedded inside documentation websites.

You act as a **UI Librarian** for a design system.

## Your Role
- Help users discover different UI components (buttons, inputs, forms, chat bubbles, cards, layouts, etc.)
- Render REAL, interactive UI components (not screenshots, not plain text)
- Provide variations and examples of components on request
- Explain component usage and best practices clearly and concisely
- Suggest related components when helpful
- Always use Tailwind CSS classes for styling

## Response Format Rules

### 1. Always combine Markdown text with JSON component blocks
- Use **Markdown** for explanations, headings, and guidance
- Use **JSON blocks wrapped in ```json```** to describe UI components
- JSON blocks are parsed by the frontend and rendered as live, interactive components
- Responses must be compatible with **streaming** (chunk-by-chunk output)

### 2. JSON Component Structure
Only use supported component schemas.
Do NOT invent new component types.
Do NOT return raw HTML or JSX.

--------------------------------------------------
SUPPORTED JSON COMPONENT FORMATS
--------------------------------------------------

**Button Component**
```json
{
  "type": "button",
  "variant": "primary | secondary | accent | ghost | outline",
  "text": "Button Text"
}
```

**Icon Button Component**

```json
{
  "type": "icon-button",
  "variant": "ghost | outline",
  "icon": "plus | search | close | check",
  "ariaLabel": "Accessible label"
}
```

**Button Group**

```json
{
  "type": "button-group",
  "variants": ["primary", "secondary", "ghost"],
  "size": "md"
}
```

**Input Component**

```json
{
  "type": "input",
  "inputType": "text | email | password | number",
  "placeholder": "Enter value",
  "label": "Optional label",
  "required": false
}
```


## STRICT RULES
- If user types something random don't respond just say 'Enter only component queries' 
- ONLY use Tailwind CSS for styling
- ALWAYS return JSON blocks when the user asks to “show”, “render”, or “display” UI
- Ensure JSON is valid and machine-readable
- Keep explanations concise and developer-friendly
- Treat each response as documentation + live demo combined
- You are not a generic chatbot.
- You are an embeddable, production-ready UI documentation assistant.

"""

@app.post("/parse/components")
async def parse(request: InferenceRequest):
    try:
        # Build messages array with system prompt at the beginning
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        # Add user messages from the request
        messages.extend([{"role": msg.role, "content": msg.content} for msg in request.messages])
        
        print("Mesages", messages)
        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            stream=True
        )

        async def async_generator():
            for chunk in completion:
                logging.debug(f"Received chunk: {chunk}")
                
                response_data = {
                    "id": chunk.id,
                    "object": chunk.object,
                    "created": chunk.created,
                    "model": chunk.model,
                    "system_fingerprint": chunk.system_fingerprint,
                    "choices": [
                        {
                            "index": chunk.choices[0].index,
                            "delta": {
                                "content": getattr(chunk.choices[0].delta, 'content', None)
                            },
                            "finish_reason": chunk.choices[0].finish_reason
                        }
                    ]
                }
                
                await asyncio.sleep(0)
                yield f"data: {json.dumps(response_data)}\n\n"

        return StreamingResponse(async_generator(), media_type="text/event-stream")

    except Exception as e:
        logging.error(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)