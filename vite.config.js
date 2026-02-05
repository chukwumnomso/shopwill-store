// vite.config.js
import { defineConfig } from "vite";
import { resolve } from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/shopwill-store/",
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        products: resolve(__dirname, "products.html"),
        carts: resolve(__dirname, "cart.html"),
        maincart: resolve(__dirname, "maincart.html"),
      },
    },
  },
});
