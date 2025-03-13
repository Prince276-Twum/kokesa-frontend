import { Sidebar } from "lucide-react";
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
          DEFAULT: "#EB5017",
          light: "#FF6B3D",
          dark: "#D14614",
          neutra: "f97316 ",
          50: "#FFF1EC",
          100: "#FFE4D9",
          200: "#FFCAB3",
          300: "#FFA98C",
          400: "#FF8866",
          500: "#EB5017", // Your main brand color

          600: "#D14614",
          700: "#B83C11",
          800: "#9F330E",
          900: "#862A0B",
        },

        secondary: {
          DEFAULT: "#1A1A1A",
          light: "#666666",
          dark: "#000000",
          hover: "#FFECE5",
          Sidebar: "#101928",
        },
        text: {
          primary: "#1A1A1A", // Main text color
          secondary: "#666666", // Secondary text color
          light: "#999999", // Light text color
          white: "#FFFFFF", // White text
          muted: "#6B7280", // Gray-500 equivalent
        },

        // Gray shades
        gray: {
          50: "#F9FAFB", // Lightest gray (nearly white)
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          550: "#667185",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827", // Darkest gray (nearly black)
        },
      },

      transparent: "transparent",
      "black/60": "rgba(0, 0, 0, 0.6)",
      "black/40": "rgba(0, 0, 0, 0.4)",
      "primary/10": "rgba(235, 80, 23, 0.1)",

      fontFamily: {
        manrope: ["Manrope", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
