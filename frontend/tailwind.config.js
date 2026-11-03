/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sankalp: {
          50: '#fbf8f2',
          100: '#f5eee1',
          200: '#ebdcc3',
          500: '#c58b37',
          600: '#b17429',
          700: '#8e561e',
          800: '#6f421a',
          900: '#46270e',
        },
        navy: {
          800: '#0f172a',
          900: '#0b1120',
          950: '#060a12',
        }
      }
    },
  },
  plugins: [],
}

