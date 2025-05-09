/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#3B82F6",  // sky-500
          DEFAULT: "#1E40AF",// indigo-800
          dark: "#1E3A8A",   // indigo-900
        },
        accent: "#0EA5E9",   // cyan‑500
      },
      boxShadow: {
        card: "0 8px 24px rgba(0,0,0,0.12)",
      },
      borderRadius: {
        "2xl": "1rem",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
}; 