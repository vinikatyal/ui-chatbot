import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
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
        // ---------- ES build (code-split + manual chunks) ----------
        {
          format: "es",
          entryFileNames: "chat-widget.es.js",
          chunkFileNames: "chunks/[name]-[hash].js",
          assetFileNames: "assets/[name]-[hash][extname]",

          manualChunks(id) {
            if (!id.includes("node_modules")) return;

            // React core
            if (id.includes("/react/") || id.includes("/react-dom/"))
              return "react";

            // Ant Design
            if (id.includes("/antd/") || id.includes("@ant-design"))
              return "antd";

            // MUI
            if (id.includes("/@mui/")) return "mui";

            // Emotion (used by MUI)
            if (id.includes("/@emotion/")) return "emotion";

            // Markdown stack
            if (
              id.includes("/react-markdown/") ||
              id.includes("/remark-") ||
              id.includes("/rehype-")
            )
              return "markdown";

            // IndexedDB
            if (id.includes("/idb/")) return "idb";

            // Everything else
            return "vendor";
          },
        },

        // ---------- UMD build (single-file, no code-splitting) ----------
        {
          format: "umd",
          name: "ChatWidgetDemo",
          entryFileNames: "chat-widget.umd.js",
          assetFileNames: "assets/[name]-[hash][extname]",
          inlineDynamicImports: true, // IMPORTANT: prevents extra chunks in UMD
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
