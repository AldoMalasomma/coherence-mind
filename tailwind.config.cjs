/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{astro,ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '1.5rem'
    },
    extend: {
      colors: {
        ink: '#081820',
        mist: '#F4F1EA',
        paper: '#F8F7F3',
        teal: '#2F7778',
        tealSoft: '#6FA9A5',
        accent: '#D9942B',
        accentMuted: '#F0B453'
      },
      fontFamily: {
        sans: ['"Inter var"', 'system-ui', 'sans-serif'],
        display: ['"Cormorant Garamond"', '"Libre Baskerville"', 'Georgia', 'serif']
      },
      boxShadow: {
        depth: '0 22px 70px rgba(8, 24, 32, 0.28)'
      }
    }
  },
  plugins: []
};
