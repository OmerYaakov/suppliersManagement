import { defineConfig } from "vite";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

export default defineConfig({
  server: {
    port: 5173, // Ensure Vite uses port 5173 explicitly
    host: "0.0.0.0", // Expose on all network interfaces for Docker compatibility
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    },
  },
  preview: {
    port: 5173, // Ensure Vite preview uses port 5173 explicitly
    host: "0.0.0.0", // Expose on all network interfaces for Docker compatibility
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    },
  },
  optimizeDeps: {
    include: ["jwt-decode"],
  },
});
