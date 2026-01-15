/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4A90E2',
        accent: '#A66BFF',
        dark: '#0F0F0F',
        'deep-dark': '#050505',
        'soft-grey': '#B8B8B8',
        'craly-blue': '#1D4ED8',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'grid-white': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(255 255 255 / 0.05)'%3E%3Cpath d='M0 .5H31.5V32'/%3E%3C/svg%3E\")",
      }
    },
  },
  plugins: [],
}


