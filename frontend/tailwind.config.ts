import type { Config } from "tailwindcss";
import { heroui } from "@heroui/react";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--card)",
        "card-hover": "var(--card-hover)",
        border: "var(--border)",
        muted: "var(--muted)",
        "accent-blue": "var(--accent-blue)",
        "accent-green": "var(--accent-green)",
        "accent-purple": "var(--accent-purple)",
        "accent-orange": "var(--accent-orange)",
        "accent-yellow": "var(--accent-yellow)",
        "accent-cyan": "var(--accent-cyan)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};

export default config;
