import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        spa: {
          DEFAULT: "#0D1F1A",
          900: "#0D1F1A",
          800: "#162820",
          700: "#1E3329",
        },
        sage: {
          DEFAULT: "#7FAE8A",
          light: "#9FC5A7",
          dark: "#5E8C67",
        },
        cream: {
          DEFAULT: "#F5F0E8",
          100: "#FAF8F4",
          200: "#F5F0E8",
          300: "#EBE4D6",
        },
        card: "#162820",
      },
      fontFamily: {
        display: ["Cormorant Garamond", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
