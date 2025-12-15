import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/widget.tsx"),
      name: "ChatWidgetDemo",
      formats: ["umd", "es"],
      fileName: (format) => `chat-widget.${format}.js`,
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
        assetFileNames: "chat-widget.[ext]",
      },
    },
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
    "process.env": "{}",
    global: "globalThis",
  },
});
