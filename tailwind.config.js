/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Authentic Amazon palette
        amazon: {
          // Header / Nav
          navy: '#102331',
          navylight: '#193747',
          navyxlight: '#315368',
          // Orange logo & links
          orange: '#F5A623',
          orangelight: '#FFC15A',
          orangedark: '#FFD38A',
          // CTAs
          yellow: '#FFD769',
          yellowHover: '#FFC94A',
          buy: '#FFB545',
          buyHover: '#F39A22',
          // Surfaces
          bg: '#F5F3EE',
          panel: '#FBFAF8',
          border: '#D8DEE2',
          borderDark: '#AEB9C0',
          // Text
          text: '#17212B',
          textMuted: '#66737D',
          link: '#087F6C',
          linkHover: '#056354',
          // States
          deal: '#CC0C39',
          prime: '#00A8E1',
          green: '#087F6C',
          greenDark: '#056B5A',
          red: '#B12704',
          // Stars
          star: '#FFA41C',
        },
      },
      fontFamily: {
        amazon: ['"Amazon Ember"', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,0.08), 0 1px 1px rgba(0,0,0,0.04)',
        cardHover: '0 4px 14px rgba(0,0,0,0.12)',
        header: '0 2px 4px rgba(0,0,0,0.2)',
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
