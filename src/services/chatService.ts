import type { Message, ComponentData } from "@/types";

export interface ChatServiceConfig {
  apiUrl: string;
  onError?: (error: Error) => void;
}

export class ChatService {
  private apiUrl: string;
  private onError?: (error: Error) => void;

  constructor(config: ChatServiceConfig) {
    this.apiUrl = config.apiUrl;
    this.onError = config.onError;
  }
  async *streamResponse(
    messages: Message[]
  ): AsyncGenerator<{ content: string; components?: ComponentData[] }> {
    try {
      // Convert messages to the format expected by the backend
      const requestMessages = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await fetch(`${this.apiUrl}/parse/components`, {
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

    // Extract library (default to 'tailwind' if not specified)
    const library = (data.library as "mui" | "antd" | "tailwind") || "tailwind";

    // Handle library-level component array

    // we can also add AI layer here for conversion read via AI Agent
    if (data.library && Array.isArray(data.components)) {
      data.components.forEach((comp: Record<string, unknown>) => {
        const converted = this.convertToComponentData({
          ...comp,
          library: data.library,
        });
        components.push(...converted);
      });
      return components;
    }

    // Normalize component type to lowercase for comparison
    const type = (data.type as string)?.toLowerCase() || "";
    const props = (data.props as Record<string, unknown>) || {};

    // ======================
    // MATERIAL-UI COMPONENTS
    // ======================
    if (library === "mui") {
      switch (type) {
        case "button":
          components.push({
            type: "button",
            library: "mui",
            props: {
              variant: props.variant || "contained",
              color: props.color || "primary",
              size: props.size || "medium",
              disabled: props.disabled || false,
              children: props.children || props.text || "Button",
              ...props,
            },
            id: `mui-btn-${Date.now()}-${Math.random()}`,
          });
          break;

        case "textfield":
          components.push({
            type: "textfield",
            library: "mui",
            props: {
              label: props.label || "",
              variant: props.variant || "outlined",
              type: props.type || "text",
              placeholder: props.placeholder || "",
              required: props.required || false,
              fullWidth: props.fullWidth !== undefined ? props.fullWidth : true,
              size: props.size || "medium",
              ...props,
            },
            id: `mui-textfield-${Date.now()}-${Math.random()}`,
          });
          break;

        case "card":
          components.push({
            type: "card",
            library: "mui",
            props: {
              elevation: props.elevation || 1,
              variant: props.variant || "outlined",
              children: props.children || "Card content",
              ...props,
            },
            id: `mui-card-${Date.now()}-${Math.random()}`,
          });
          break;

        case "chip":
          components.push({
            type: "chip",
            library: "mui",
            props: {
              label: props.label || "Chip",
              color: props.color || "default",
              variant: props.variant || "filled",
              size: props.size || "medium",
              clickable: props.clickable || false,
              ...props,
            },
            id: `mui-chip-${Date.now()}-${Math.random()}`,
          });
          break;

        case "switch":
          components.push({
            type: "switch",
            library: "mui",
            props: {
              defaultChecked: props.defaultChecked || false,
              color: props.color || "primary",
              size: props.size || "medium",
              disabled: props.disabled || false,
              ...props,
            },
            id: `mui-switch-${Date.now()}-${Math.random()}`,
          });
          break;

        default:
          console.warn(`Unknown MUI component type: ${type}`);
      }
      return components;
    }

    // =======================
    // ANT DESIGN COMPONENTS
    // =======================
    if (library === "antd") {
      switch (type) {
        case "button":
          components.push({
            type: "button",
            library: "antd",
            props: {
              type: props.type || "primary",
              danger: props.danger || false,
              size: props.size || "middle",
              disabled: props.disabled || false,
              loading: props.loading || false,
              children: props.children || props.text || "Button",
              ...props,
            },
            id: `antd-btn-${Date.now()}-${Math.random()}`,
          });
          break;

        case "input":
          components.push({
            type: "input",
            library: "antd",
            props: {
              placeholder: props.placeholder || "",
              type: props.type || "text",
              size: props.size || "middle",
              disabled: props.disabled || false,
              allowClear:
                props.allowClear !== undefined ? props.allowClear : true,
              ...props,
            },
            id: `antd-input-${Date.now()}-${Math.random()}`,
          });
          break;

        case "card":
          // removed props its causing issues
          components.push({
            type: "card",
            library: "antd",
            props: {
              title: props.title || "",
              variant:
                props.variant ??
                (props.bordered === false ? "borderless" : "outlined"),
              hoverable: !!props.hoverable,
              size: props.size || "default",
              children: props.children || "Card content"
            },
            id: `antd-card-${Date.now()}-${Math.random()}`,
          });

          break;

        case "tag":
          components.push({
            type: "tag",
            library: "antd",
            props: {
              color: props.color || "blue",
              closable: props.closable || false,
              children: props.children || props.text || "Tag",
              ...props,
            },
            id: `antd-tag-${Date.now()}-${Math.random()}`,
          });
          break;

        case "switch":
          components.push({
            type: "switch",
            library: "antd",
            props: {
              defaultChecked: props.defaultChecked || false,
              size: props.size || "default",
              disabled: props.disabled || false,
              loading: props.loading || false,
              ...props,
            },
            id: `antd-switch-${Date.now()}-${Math.random()}`,
          });
          break;

        default:
          console.warn(`Unknown Ant Design component type: ${type}`);
      }
      return components;
    }

    // ========================
    // TAILWIND CUSTOM COMPONENTS
    // ========================
    if (library === "tailwind") {
      switch (type) {
        case "button":
          components.push({
            type: "button",
            library: "tailwind",
            props: {
              variant: props.variant || data.variant || "primary",
              text: props.text || props.children || data.text || "Button",
              disabled: props.disabled || false,
              ...props,
            },
            id: `tailwind-btn-${Date.now()}-${Math.random()}`,
          });
          break;

        case "input":
          components.push({
            type: "input",
            library: "tailwind",
            props: {
              inputType: props.inputType || data.inputType || "text",
              placeholder: props.placeholder || data.placeholder || "",
              label: props.label || data.label || "",
              required: props.required || data.required || false,
              disabled: props.disabled || false,
              ...props,
            },
            id: `tailwind-input-${Date.now()}-${Math.random()}`,
          });
          break;

        case "chatbubble":
          components.push({
            type: "chatbubble",
            library: "tailwind",
            props: {
              variant: props.variant || data.variant || "assistant",
              message:
                props.message ||
                data.message ||
                props.text ||
                data.text ||
                "Message",
              ...props,
            },
            id: `tailwind-chatbubble-${Date.now()}-${Math.random()}`,
          });
          break;

        case "card":
          components.push({
            type: "card",
            library: "tailwind",
            props: {
              title: props.title || data.title || "",
              content:
                props.content ||
                props.children ||
                data.content ||
                "Card content",
              ...props,
            },
            id: `tailwind-card-${Date.now()}-${Math.random()}`,
          });
          break;

        // Legacy: Handle button-group
        case "button-group":
          if (Array.isArray(data.variants)) {
            data.variants.forEach((variant: string, index: number) => {
              components.push({
                type: "button",
                library: "tailwind",
                props: {
                  variant: variant,
                  text: `${
                    variant.charAt(0).toUpperCase() + variant.slice(1)
                  } Button`,
                },
                id: `tailwind-btn-group-${index}-${Date.now()}`,
              });
            });
          }
          break;

        default:
          console.warn(`Unknown Tailwind component type: ${type}`);
      }
      return components;
    }

    return components;
  }
}
