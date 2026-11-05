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
          navy: '#10233F',
          navylight: '#1F466B',
          navyxlight: '#46607D',
          // Orange logo & links
          orange: '#FF795E',
          orangelight: '#E75D43',
          orangedark: '#FFB39F',
          // CTAs
          yellow: '#FFD166',
          yellowHover: '#F5BE43',
          buy: '#FF795E',
          buyHover: '#E75D43',
          // Surfaces
          bg: '#F4F7FB',
          panel: '#F8FAFC',
          border: '#DCE6F0',
          borderDark: '#B8C7D6',
          // Text
          text: '#10233F',
          textMuted: '#6B7B8F',
          link: '#216B91',
          linkHover: '#E75D43',
          // States
          deal: '#C94D3D',
          prime: '#338BB6',
          green: '#16805D',
          greenDark: '#08734E',
          red: '#B3382A',
          // Stars
          star: '#F3A93B',
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
