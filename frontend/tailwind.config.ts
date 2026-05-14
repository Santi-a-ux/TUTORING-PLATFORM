import type { Config } from "tailwindcss"

const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#070710",
        surface: "#0e0e1c",
        surface2: "#13131f",
        accent: "#7c5cfc",
        accent2: "#a78bfa",
      },
      fontFamily: {
        display: ["Syne", "sans-serif"],
        body: ["DM Sans", "sans-serif"],
        sans: ["DM Sans", "sans-serif"],
      },
      fontSize: {
        xs: ["12px", "16px"],
        sm: ["14px", "20px"],
        base: ["16px", "24px"],
        lg: ["18px", "28px"],
        xl: ["20px", "28px"],
        "2xl": ["24px", "32px"],
        "3xl": ["30px", "36px"],
        "4xl": ["36px", "43px"],
        "5xl": ["48px", "50px"],
      },
      boxShadow: {
        glow: "0 0 8px rgba(124, 92, 252, 0.25)",
        "glow-sm": "0 0 4px rgba(124, 92, 252, 0.15)",
        "glow-lg": "0 0 16px rgba(124, 92, 252, 0.3)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "accent-glow": "radial-gradient(ellipse at top center, rgba(124, 92, 252, 0.15), transparent 70%)",
      },
    },
  },
  plugins: [],
} satisfies Config

export default config
