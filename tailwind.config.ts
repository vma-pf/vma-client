import { nextui } from "@nextui-org/react";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#10b981",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        blink: {
          "0%, 10%, 80%, 100%": { color: "gray" },
          "20% ,30%, 40%, 60%": { color: "red" },
        },
      },
      animation: {
        blink: "blink 1s linear infinite",
      },
    },
  },
  darkMode: ["class"],
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            background: "#f9f9f9",
          },
        },
        dark: {
          colors: {
            background: "#0f0f0f",
          },
        },
      },
    }),
    require("tailwindcss-animate"),
  ],
};
export default config;
