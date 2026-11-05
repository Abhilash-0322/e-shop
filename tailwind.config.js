/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Shared marketplace palette. Existing class names stay stable so
        // the backend-facing screens can be restyled without changing flows.
        amazon: {
          navy: '#17202a',
          navylight: '#253447',
          navyxlight: '#3b4c60',
          orange: '#ec6a4b',
          orangelight: '#f28768',
          orangedark: '#c94f38',
          yellow: '#d9f06b',
          yellowHover: '#c7e452',
          buy: '#d9f06b',
          buyHover: '#c7e452',
          bg: '#f7f5ef',
          panel: '#fffdf8',
          border: '#e6e0d5',
          borderDark: '#cfc6b7',
          text: '#17202a',
          textMuted: '#69717b',
          link: '#1d7a78',
          linkHover: '#145957',
          deal: '#d04f68',
          prime: '#1d7a78',
          green: '#4f8b68',
          greenDark: '#397152',
          red: '#bf4f43',
          star: '#e8a04c',
        },
      },
      fontFamily: {
        amazon: ['"Amazon Ember"', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        card: '0 8px 24px rgba(23,32,42,0.06)',
        cardHover: '0 18px 40px rgba(23,32,42,0.14)',
        header: '0 8px 28px rgba(23,32,42,0.12)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseRing: {
          '0%': { boxShadow: '0 0 0 0 rgba(255,153,0,.6)' },
          '70%': { boxShadow: '0 0 0 12px rgba(255,153,0,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(255,153,0,0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s linear infinite',
        fadeIn: 'fadeIn .35s ease-out both',
        slideDown: 'slideDown .25s ease-out both',
        scaleIn: 'scaleIn .2s ease-out both',
        pulseRing: 'pulseRing 1.6s cubic-bezier(0.4,0,0.6,1) infinite',
        marquee: 'marquee 30s linear infinite',
      },
    },
  },
  plugins: [],
};
