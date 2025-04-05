import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],

  safelist: [
    // Explicit class names
    "hover:text-amber-600",
    "hover:text-purple-600",
    "hover:text-emerald-600",
    "hover:text-slate-600",
    "stroke-purple-500",
    "stroke-emerald-500",
    "stroke-amber-500",
    "stroke-slate-500",
    "border-color-purple",

    {
      pattern:
        /bg-(purple|emerald|amber|slate|green|yellow|pink|gray|teal|indigo)-600/,
    },
    {
      pattern:
        /text-(purple|emerald|amber|slate|green|yellow|pink|gray|teal|indigo)-600/,
    },
  ],

  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "theme-color": "var(--global-theme)", // Use the CSS variable as a Tailwind color
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            primary: {
              DEFAULT: "#ccc",
              foreground: "#000000",
            },
            focus: "#aaa",
          },
        },
      },
    }),
  ],
};
export default config;
