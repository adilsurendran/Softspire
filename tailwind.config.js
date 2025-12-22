/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./*.html",
    "./assets/**/*.js",
    "./script.js"
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors
        softRed: "#EE2F50",
        "softRed-hover": "#d62a48",

        // Aliases used in components
        primary: "#EE2F50",
        "primary-hover": "#d62a48",
      },

      fontFamily: {
        sans: ["Poppins", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },

      boxShadow: {
        glow: "0 4px 20px rgba(238, 47, 80, 0.4)",
        "glow-hover": "0 4px 25px rgba(238, 47, 80, 0.6)",
      },

      animation: {
        "spin-slow": "spin 12s linear infinite",
      },
    },
  },
  plugins: [],
};

