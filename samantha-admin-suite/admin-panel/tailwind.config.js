/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'primary': '#D4AF37',
        'secondary': '#121212',
        'accent': '#F7D9DB',
        'background': '#FFFFFF',
        'text': '#2B2B2B'
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
        'display': ['"Playfair Display"', 'serif']
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}