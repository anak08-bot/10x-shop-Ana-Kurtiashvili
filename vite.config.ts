import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Tailwind CSS v4 is integrated through its official Vite plugin (no PostCSS config needed).
export default defineConfig({
  plugins: [react(), tailwindcss()],
});
