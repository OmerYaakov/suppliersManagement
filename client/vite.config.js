import { defineConfig } from "vite";
<<<<<<< HEAD
import dotenv from "dotenv";
=======
import dotenv from "dotenv-flow";
>>>>>>> clean-supplierPage
import react from "@vitejs/plugin-react";

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
<<<<<<< HEAD
=======
    proxy: {
      "/api": "http://localhost:5000",
    },
>>>>>>> clean-supplierPage
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
  plugins: [react()],
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress warnings related to 'use client' directives
        if (warning.code === "MODULE_LEVEL_DIRECTIVE") return;
        warn(warning);
      },
    },
  },
<<<<<<< HEAD
=======
  define: {
    "process.env": process.env,
  },
>>>>>>> clean-supplierPage
});
