/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#663399",
        secondary: "#687076",
        text: "#11181C",
        background: "#fff",
        tint: "#0a7ea4",
        icon: "#687076"
      },
    },
  },
  plugins: [],
}