// vite.config.js
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/shopwill store/",
  plugins: [tailwindcss()],
});
