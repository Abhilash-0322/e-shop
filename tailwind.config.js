/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Cyber-clean signal palette. Legacy amazon-* class names are retained
        // so the existing shopping, auth, seller, and admin contracts stay intact.
        amazon: {
          navy: '#05070b',
          navylight: '#0c111a',
          navyxlight: '#172231',
          orange: '#55f3ff',
          orangelight: '#9bfbff',
          orangedark: '#14b8c8',
          yellow: '#55f3ff',
          yellowHover: '#9bfbff',
          buy: '#9a7cff',
          buyHover: '#b7a4ff',
          bg: '#070a10',
          panel: '#0c111a',
          border: '#253244',
          borderDark: '#3b4d63',
          text: '#f2f5f7',
          textMuted: '#8e9aaa',
          link: '#55f3ff',
          linkHover: '#b7a4ff',
          deal: '#ff5d8f',
          prime: '#55f3ff',
          green: '#52e0ae',
          greenDark: '#52e0ae',
          red: '#ff789c',
          star: '#f5d76e',
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
