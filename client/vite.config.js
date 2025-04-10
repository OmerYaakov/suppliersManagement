import { defineConfig } from "vite";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

export default defineConfig({
  server: {
    port: process.env.VITE_PORT || 5173, // This sets the port to either the value in .env or defaults to 5173
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    },
  },
});
