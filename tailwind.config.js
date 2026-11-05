/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Compatibility aliases retained for existing route components.
        amazon: {
          navy: '#11121A',
          navylight: '#26273A',
          navyxlight: '#3B3D58',
          orange: '#D8FF3E',
          orangelight: '#E7FF86',
          orangedark: '#A8CC20',
          yellow: '#D8FF3E',
          yellowHover: '#C4ED2F',
          buy: '#34D6DE',
          buyHover: '#1CBAC3',
          bg: '#F4F6F8',
          panel: '#FBFCFD',
          border: '#E1E5EA',
          borderDark: '#C7CDD6',
          text: '#11121A',
          textMuted: '#667085',
          link: '#6552D8',
          linkHover: '#4E3FC0',
          deal: '#E04986',
          prime: '#34D6DE',
          green: '#28B985',
          greenDark: '#168B64',
          red: '#D64965',
          star: '#FFB547',
        },
        kinetic: {
          ink: '#11121A',
          lime: '#D8FF3E',
          violet: '#7C5CFF',
          cyan: '#34D6DE',
          pink: '#FF5CA8',
        },
      },
      fontFamily: {
        amazon: ['"Amazon Ember"', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        card: '0 10px 30px rgba(17, 18, 26, 0.06)',
        cardHover: '0 18px 42px rgba(17, 18, 26, 0.14)',
        header: '0 12px 30px rgba(17, 18, 26, 0.16)',
        glow: '0 0 0 1px rgba(216,255,62,.16), 0 18px 60px rgba(124,92,255,.18)',
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
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(-2deg)' },
          '50%': { transform: 'translateY(-10px) rotate(2deg)' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s linear infinite',
        fadeIn: 'fadeIn .35s ease-out both',
        slideDown: 'slideDown .25s ease-out both',
        scaleIn: 'scaleIn .2s ease-out both',
        pulseRing: 'pulseRing 1.6s cubic-bezier(0.4,0,0.6,1) infinite',
        marquee: 'marquee 30s linear infinite',
        float: 'float 5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
