/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eeedff',
          100: '#dedbff',
          200: '#c5c0ff',
          500: '#5b50e6',
          600: '#5045d2',
          700: '#4438b8',
          800: '#382e91',
        },
        surface: {muted: '#f8fafc'},
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 12px 34px rgba(15, 23, 42, .08)',
        float: '0 24px 70px rgba(29, 24, 77, .16)',
      },
      keyframes: {
        shimmer: {
          '0%': {backgroundPosition: '100% 0'},
          '100%': {backgroundPosition: '-100% 0'},
        },
      },
      animation: {shimmer: 'shimmer 1.6s ease-in-out infinite'},
    },
  },
  plugins: [],
};
