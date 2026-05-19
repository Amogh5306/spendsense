import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          deep: "#050A0E",
          darker: "#0A1018",
          dark: "#0F1922",
        },
        cyan: {
          electric: "#00F5FF",
          glow: "rgba(0, 245, 255, 0.4)",
          dim: "rgba(0, 245, 255, 0.15)",
        },
        orange: {
          plasma: "#FF6B2B",
          glow: "rgba(255, 107, 43, 0.4)",
        },
        lime: {
          acid: "#B8FF00",
          glow: "rgba(184, 255, 0, 0.4)",
        },
        silver: {
          steel: "#8A9BB0",
        },
        ghost: {
          white: "#E8F4F8",
        },
        // Category colors
        cat: {
          food: "#F5A623",
          transport: "#4A90D9",
          academics: "#B8FF00",
          entertainment: "#FF6B6B",
          shopping: "#2DD4BF",
          subscriptions: "#FF6B2B",
          misc: "#8A9BB0",
        },
      },
      fontFamily: {
        orbitron: ["var(--font-orbitron)", "monospace"],
        jetbrains: ["var(--font-jetbrains)", "monospace"],
        barlow: ["var(--font-barlow)", "sans-serif"],
      },
      animation: {
        "float-slow": "floatY 6s ease-in-out infinite",
        "float-medium": "floatY 4s ease-in-out infinite",
        "float-fast": "floatY 3s ease-in-out infinite",
        "pulse-orange": "pulseOrange 2s ease-in-out infinite",
        "pulse-cyan": "pulseCyan 2s ease-in-out infinite",
        "scanline": "scanline 3s linear infinite",
        "glow-border": "glowBorder 2s ease-in-out infinite alternate",
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "slide-in-right": "slideInRight 0.4s ease-out forwards",
        "count-up": "fadeUp 0.8s ease-out forwards",
        "star-twinkle": "twinkle 4s ease-in-out infinite",
      },
      keyframes: {
        floatY: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        pulseOrange: {
          "0%, 100%": { boxShadow: "0 0 15px rgba(255, 107, 43, 0.3)" },
          "50%": { boxShadow: "0 0 30px rgba(255, 107, 43, 0.6)" },
        },
        pulseCyan: {
          "0%, 100%": { boxShadow: "0 0 15px rgba(0, 245, 255, 0.2)" },
          "50%": { boxShadow: "0 0 30px rgba(0, 245, 255, 0.5)" },
        },
        scanline: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        glowBorder: {
          "0%": { borderColor: "rgba(0, 245, 255, 0.3)" },
          "100%": { borderColor: "rgba(0, 245, 255, 0.7)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        twinkle: {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "1" },
        },
      },
      boxShadow: {
        "glow-cyan": "0 0 20px rgba(0, 245, 255, 0.3), 0 0 60px rgba(0, 245, 255, 0.1)",
        "glow-orange": "0 0 20px rgba(255, 107, 43, 0.3), 0 0 60px rgba(255, 107, 43, 0.1)",
        "glow-lime": "0 0 20px rgba(184, 255, 0, 0.3), 0 0 60px rgba(184, 255, 0, 0.1)",
        "float": "0 20px 60px rgba(0, 0, 0, 0.5)",
      },
    },
  },
  plugins: [],
};
export default config;
