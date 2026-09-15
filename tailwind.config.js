/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#FAF9F6',
          dark: '#141416',
        }
      },
      fontFamily: {
        // One interface face. Alternate utility names resolve to the same type
        // so an old class cannot quietly introduce a second visual voice.
        sans: ['"Inter Variable"', 'Inter', 'sans-serif'],
        mono: ['"Inter Variable"', 'Inter', 'sans-serif'],
        serif: ['"Inter Variable"', 'Inter', 'sans-serif'],
        handwriting: ['"Inter Variable"', 'Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}
