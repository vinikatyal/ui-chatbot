import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  base: "./",

  plugins: [
    react(),
    visualizer({
      filename: "dist/stats.html",
      gzipSize: true,
      brotliSize: true,
      open: false,
    }),
  ],

  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },

  build: {
    lib: {
      entry: resolve(__dirname, "src/widget.tsx"),
      name: "ChatWidgetDemo",
      formats: ["es", "umd"],
      fileName: (format) => `chat-widget.${format}.js`,
    },

    sourcemap: true,
    minify: "esbuild",
    cssCodeSplit: true,
    target: "es2018",

    rollupOptions: {
      external: [],
      output: [
        // ES build: code-splitting + chunks
        {
          format: "es",
          entryFileNames: "chat-widget.es.js",
          chunkFileNames: "chunks/[name]-[hash].js",
          assetFileNames: "assets/[name]-[hash][extname]",

          manualChunks(id) {
            if (!id.includes("node_modules")) return;

            if (id.includes("/react/") || id.includes("/react-dom/"))
              return "react";
            if (id.includes("/antd/") || id.includes("@ant-design"))
              return "antd";
            if (id.includes("/@mui/")) return "mui";
            if (id.includes("/@emotion/")) return "emotion";
            if (
              id.includes("/react-markdown/") ||
              id.includes("/remark-") ||
              id.includes("/rehype-")
            )
              return "markdown";
            if (
              id.includes("/react-live/") ||
              id.includes("/prism") ||
              id.includes("/buble")
            )
              return "live-editor";
            if (id.includes("/idb/")) return "idb";

            return "vendor";
          },
        },
        {
          format: "umd",
          name: "ChatWidgetDemo",
          entryFileNames: "chat-widget.umd.js",
          assetFileNames: "assets/[name]-[hash][extname]",
          inlineDynamicImports: true,
          globals: {},
        },
      ],
    },
  },

  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
    "process.env": "{}",
    global: "globalThis",
  },
});
