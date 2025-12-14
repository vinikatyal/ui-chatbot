import type { Message, ComponentData } from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export class ChatService {
  async *streamResponse(
    messages: Message[]
  ): AsyncGenerator<{ content: string; components?: ComponentData[] }> {
    try {
      // Convert messages to the format expected by the backend
      const requestMessages = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await fetch(`${API_BASE_URL}/parse/components`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: requestMessages,
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error("Response body is null");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let accumulatedContent = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || ""; // Keep incomplete line in buffer

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6); // Remove 'data: ' prefix

            if (data === "[DONE]") {
              continue;
            }

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;

              if (content) {
                accumulatedContent += content;
                yield { content: accumulatedContent };
              }
              
              if (parsed.choices?.[0]?.finish_reason) {
                // Parse components from the final content
                const components =
                  this.parseComponentsFromContent(accumulatedContent);
                if (components.length > 0) {
                  yield { content: accumulatedContent, components };
                } else {
                  yield { content: accumulatedContent };
                }
              }
            } catch (e) {
              console.error("Error parsing data:", e);
            }
          }
        }
      }
    } catch (error) {
      console.error("Stream error:", error);
      throw error;
    }
  }

  private parseComponentsFromContent(content: string): ComponentData[] {
    const components: ComponentData[] = [];

    const jsonBlockRegex = /```json\s*([\s\S]*?)```/g;
    const matches = content.matchAll(jsonBlockRegex);

    for (const match of matches) {
      const jsonString = match[1].trim();

      try {
        const parsed = JSON.parse(jsonString);
        const converted = this.convertToComponentData(parsed);
        components.push(...converted);
      } catch (e) {
        console.error("Failed to parse JSON block:", e, jsonString);
      }
    }

    return components;
  }

  private convertToComponentData(
    data: Record<string, unknown>
  ): ComponentData[] {
    const components: ComponentData[] = [];

    if (!data || typeof data !== "object") {
      return components;
    }

    if (data.type === "button-group" && Array.isArray(data.variants)) {
      data.variants.forEach((variant: string, index: number) => {
        components.push({
          type: "button",
          props: {
            variant: variant,
            children: `${
              variant.charAt(0).toUpperCase() + variant.slice(1)
            } Button`,
          },
          id: `btn-group-${index}-${Date.now()}`,
        });
      });
      return components;
    }

    if (data.type === "ui-group" && Array.isArray(data.components)) {
      data.components.forEach((comp: Record<string, unknown>) => {
        const converted = this.convertToComponentData(comp);
        components.push(...converted);
      });
      return components;
    }

    // Handle single button
    if (data.type === "button") {
      components.push({
        type: "button",
        props: {
          variant: data.variant || "primary",
          children: data.text || data.children || "Button",
        },
        id: `btn-${Date.now()}-${Math.random()}`,
      });
      return components;
    }

    if (data.type === "input") {
      components.push({
        type: "input",
        props: {
          inputType: data.inputType || "text",
          placeholder: data.placeholder || "",
          label: data.label,
          required: data.required || false,
        },
        id: `input-${Date.now()}-${Math.random()}`,
      });
      return components;
    }

    // Handle chatBubble if present
    if (data.type === "chatBubble") {
      components.push({
        type: "chatBubble",
        props: {
          variant: data.variant || "assistant",
          message: data.message || data.text || "Message",
        },
        id: `chatbubble-${Date.now()}-${Math.random()}`,
      });
      return components;
    }

    // generic fallback
    if (data.type) {
      components.push({
        type: data.type as ComponentData["type"],
        props: { ...data, type: undefined }, // Remove type from props
        id: `${data.type}-${Date.now()}-${Math.random()}`,
      });
    }

    return components;
  }
}

export const chatService = new ChatService();
