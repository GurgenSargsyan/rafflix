import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
        mono: ["var(--font-roboto-mono)", "Roboto Mono", "monospace"],
      },
      colors: {
        base: {
          950: "#050508",
          900: "#0a0a0f",
          850: "#0d0d14",
          800: "#12121a",
          700: "#1a1a25",
          600: "#26263a",
        },
        neon: {
          violet: "#8b5cf6",
          fuchsia: "#d946ef",
          cyan: "#22d3ee",
          lime: "#a3e635",
          pink: "#ec4899",
        },
      },
      backgroundImage: {
        "grid-glow":
          "radial-gradient(circle at 50% 0%, rgba(139,92,246,0.18), transparent 60%)",
        "cta-gradient": "linear-gradient(135deg, #8b5cf6 0%, #d946ef 50%, #22d3ee 100%)",
      },
      boxShadow: {
        glow: "0 0 30px -5px rgba(139,92,246,0.5)",
        "glow-cyan": "0 0 30px -5px rgba(34,211,238,0.5)",
        glass: "0 8px 32px 0 rgba(0,0,0,0.37)",
      },
      backdropBlur: {
        xs: "2px",
      },
      keyframes: {
        "pulse-slow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "pulse-slow": "pulse-slow 3s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
        float: "float 6s ease-in-out infinite",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};

export default config;
