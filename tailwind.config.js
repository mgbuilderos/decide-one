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
        // Enforce Single Universal Helvetica / SF Pro Typography Stack
        sans: ['"Helvetica Neue"', 'Helvetica', '-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"SF Pro Text"', 'Inter', 'sans-serif'],
        mono: ['"Helvetica Neue"', 'Helvetica', '-apple-system', 'sans-serif'],
        serif: ['"Helvetica Neue"', 'Helvetica', '-apple-system', 'sans-serif'],
        handwriting: ['"Helvetica Neue"', 'Helvetica', '-apple-system', 'sans-serif']
      }
    },
  },
  plugins: [],
}
