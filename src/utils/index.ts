export function stripJsonCodeBlocks(text: string) {
  return text.replace(/```json\s*[\s\S]*?```/g, "").trim();
}
