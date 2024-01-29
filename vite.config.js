import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "./dist",
    lib: {
      entry: './src/bootoast.js', // Path to your entry file
      name: 'Bootoast', // The name of your global variable
      fileName: (format) => `bootoast.min.js`
    },
    rollupOptions: {
      output: {
        format: 'umd', // UMD format
        // Additional output options here
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
