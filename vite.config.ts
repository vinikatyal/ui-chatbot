// vite.config.ts (main app config)
import { defineConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

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
    outDir: "dist",
    rollupOptions: {
      external: [],
      output: [
        {
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
      ],
    },
  },
});
