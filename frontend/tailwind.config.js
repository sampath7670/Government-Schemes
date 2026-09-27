/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          blue: "#1e3a8a",
          navy: "#0f172a",
          saffron: "#f97316",
          green: "#15803d",
          accent: "#2563eb",
          light: "#f8fafc"
        }
      }
    },
  },
  plugins: [],
}
