/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Shared marketplace palette. The legacy token names keep existing routes compatible.
        amazon: {
          navy: '#152035',
          navylight: '#24324a',
          navyxlight: '#34445f',
          orange: '#f97316',
          orangelight: '#fb923c',
          orangedark: '#ea580c',
          yellow: '#fbbf24',
          yellowHover: '#f59e0b',
          buy: '#fb923c',
          buyHover: '#ea580c',
          bg: '#f5f7fb',
          panel: '#f8fafc',
          border: '#e4e7ec',
          borderDark: '#cbd5e1',
          text: '#152035',
          textMuted: '#667085',
          link: '#0f766e',
          linkHover: '#115e59',
          deal: '#c4320a',
          prime: '#0284c7',
          green: '#0f766e',
          greenDark: '#047857',
          red: '#c4320a',
          star: '#f59e0b',
        },
      },
      fontFamily: {
        amazon: ['"Amazon Ember"', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,24,40,0.04), 0 4px 12px rgba(16,24,40,0.04)',
        cardHover: '0 12px 28px rgba(16,24,40,0.12)',
        header: '0 4px 14px rgba(16,24,40,0.12)',
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
