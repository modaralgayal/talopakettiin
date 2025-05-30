import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc"; // or '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"; // if you’re using Tailwind
import sitemapPlugin from "vite-plugin-sitemap";
import { createHtmlPlugin } from "vite-plugin-html";
import path from "path";

// Define your static routes for the sitemap
const routes = ["/", "/about"];

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),


    // SEO: Sitemap generation
    sitemapPlugin({
      hostname: "https://yourdomain.com",
      routes,
      generateRobotsTxt: true,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
