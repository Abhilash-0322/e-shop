/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Halozon studio palette — kept under the existing token names so
        // product and checkout behavior can share one visual language.
        amazon: {
          navy: '#292344',
          navylight: '#51447a',
          navyxlight: '#8173a9',
          orange: '#ff7f6b',
          orangelight: '#ff9c8b',
          orangedark: '#e96063',
          yellow: '#f7d976',
          yellowHover: '#efc85a',
          buy: '#ff9c8b',
          buyHover: '#f47d72',
          bg: '#f7f4fb',
          panel: '#fcfbff',
          border: '#e7e0f3',
          borderDark: '#cfc4e4',
          text: '#292344',
          textMuted: '#716b86',
          link: '#6250a3',
          linkHover: '#44377b',
          deal: '#e96063',
          prime: '#56b9ae',
          green: '#43a98f',
          greenDark: '#2c8b76',
          red: '#d35c68',
          star: '#f0b84d',
          mint: '#dff5ee',
        },
      },
      fontFamily: {
        amazon: ['"Amazon Ember"', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        card: '0 8px 24px rgba(71, 53, 119, 0.08)',
        cardHover: '0 18px 36px rgba(71, 53, 119, 0.16)',
        header: '0 8px 24px rgba(71, 53, 119, 0.10)',
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
