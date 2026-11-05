/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Oceanic spatial palette. The legacy token names stay in place so
        // existing route components keep their API while sharing one system.
        amazon: {
          navy: '#071a2e',
          navylight: '#0d3552',
          navyxlight: '#174b6c',
          orange: '#ff8f70',
          orangelight: '#ffb39d',
          orangedark: '#ef6f52',
          yellow: '#d7f56a',
          yellowHover: '#c6e85b',
          buy: '#ff8f70',
          buyHover: '#f2785d',
          bg: '#edf6f8',
          panel: '#f7fbfc',
          border: '#d4e5ea',
          borderDark: '#a9c4cd',
          text: '#102a43',
          textMuted: '#668092',
          link: '#087e8b',
          linkHover: '#045e6a',
          deal: '#d95968',
          prime: '#55c7da',
          green: '#238b7a',
          greenDark: '#18705f',
          red: '#c95f50',
          star: '#f4ad55',
        },
      },
      fontFamily: {
        amazon: ['"Amazon Ember"', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        card: '0 18px 48px rgba(22, 65, 86, 0.09)',
        cardHover: '0 22px 52px rgba(22, 65, 86, 0.17)',
        header: '0 10px 35px rgba(4, 34, 54, 0.18)',
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
