import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "#CED4DA", // Mid Gray for borders
        input: "#CED4DA", // Mid Gray for input borders
        ring: "#52B788", // Accent Green for focus rings
        background: "#F8F9FA", // Off-white background
        foreground: "#333333", // Charcoal text
        primary: {
          DEFAULT: "#2D6A4F", // Dark green for buttons
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#1B4332", // Darker green
          foreground: "#FFFFFF",
        },
        destructive: {
          DEFAULT: "#DC3545", // Error red
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#495057", // Dark Gray
          foreground: "#333333", // Changed to charcoal for consistency
        },
        accent: {
          DEFAULT: "#52B788", // Fresh green
          foreground: "#FFFFFF",
        },
        popover: {
          DEFAULT: "#F8F9FA", // Off-white
          foreground: "#333333", // Charcoal
        },
        card: {
          DEFAULT: "#F8F9FA", // Off-white
          foreground: "#333333", // Charcoal
        },
        warning: {
          DEFAULT: "#FFC107", // Warning yellow
          foreground: "#333333", // Charcoal
        },
        info: {
          DEFAULT: "#355C7D", // Cool accent blue
          foreground: "#FFFFFF",
        },
        success: {
          DEFAULT: "#52B788", // Success green
          foreground: "#FFFFFF",
        },
        warm: {
          DEFAULT: "#F8B195", // Warm accent
          foreground: "#333333", // Charcoal
        },
        cool: {
          DEFAULT: "#355C7D", // Cool accent
          foreground: "#FFFFFF",
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;