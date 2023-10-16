/// <reference types="vitest" />
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/app/__test__/setup.ts",
  },
  resolve: {
    alias: {
      "@": __dirname + "/src",
      "@components/*": __dirname + "/src/app/_components/*",
      "@lib/*": __dirname + "/src/app/_libs/*",
    },
  },
});
