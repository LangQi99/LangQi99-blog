/** @type {import('tailwindcss').Config} */
import { addDynamicIconSelectors } from "@iconify/tailwind";
import typography from "@tailwindcss/typography";
import daisyUI from "daisyui";
import { SITE_THEME } from "./src/config";

export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"JetBrains Mono"',
          '"Fira Code"',
          '"UI Monospace"',
          '"SFMono-Regular"',
          "Menlo",
          "Monaco",
          "Consolas",
          '"Liberation Mono"',
          '"Courier New"',
          '"Microsoft YaHei"',
          "monospace",
        ],
        serif: [
          '"JetBrains Mono"',
          '"Fira Code"',
          '"UI Monospace"',
          '"SFMono-Regular"',
          "Menlo",
          "Monaco",
          "Consolas",
          '"Liberation Mono"',
          '"Courier New"',
          '"Microsoft YaHei"',
          "monospace",
        ],
        mono: [
          '"JetBrains Mono"',
          '"Fira Code"',
          '"UI Monospace"',
          '"SFMono-Regular"',
          "Menlo",
          "Monaco",
          "Consolas",
          '"Liberation Mono"',
          '"Courier New"',
          '"Microsoft YaHei"',
          "monospace",
        ],
      },
    },
  },
  safelist: [
    "alert",
    "alert-info",
    "alert-success",
    "alert-warning",
    "alert-error",
  ],
  plugins: [daisyUI, typography, addDynamicIconSelectors()],
  daisyui: {
    themes: ["light"], // Force light theme for the white background requirement
    logs: false,
  },
};
