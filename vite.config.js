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
        allProducts: resolve(__dirname, "allProducts.html"),
        viewProduct: resolve(__dirname, "viewProduct.html"),
        mainCart: resolve(__dirname, "maincart.html"),
        checkOut: resolve(__dirname, "checkout.html"),
      },
    },
  },
});
