import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "./dist",
    rollupOptions: {
      input: {
        bootoast: "./src/bootoast.js", // Specify your input JS file
      },
      output: {
        entryFileNames: "[name].min.js", // Output as bootoast.js
        // Note: For CSS, it will still output as [name].[hash].css
        assetFileNames: "bootoast.min.css", // This will not change the CSS file name as expected
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // SCSS global configurations (if any)
      },
    },
  },
});
