import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",

        primary: {
          base: "#0B0A0A", // Black
        },
        secondary: {
          contrast: "#FFFFFF", // White
        },
        accent: {
          gold: "#FFC107", // Gold for highlights and buttons
          blue: "#5B9BD5", // Soft Blue
        },
        neutral: {
          gray: "#6D6D6D",
          formBorder: "#717171",
          // Light Gray for backgrounds
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
