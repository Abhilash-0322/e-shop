/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Aurora fintech palette. Legacy amazon-* names stay stable so
        // existing routes preserve their contracts while sharing the new UI.
        amazon: {
          navy: '#07152f',
          navylight: '#102650',
          navyxlight: '#1e3a63',
          orange: '#73e4c2',
          orangelight: '#b7f4de',
          orangedark: '#35b994',
          yellow: '#b7f4de',
          yellowHover: '#8deac7',
          buy: '#73e4c2',
          buyHover: '#35b994',
          bg: '#eef3fb',
          panel: '#f8faff',
          border: '#d9e3f1',
          borderDark: '#b8c8dc',
          text: '#101c35',
          textMuted: '#63728b',
          link: '#1d5fd1',
          linkHover: '#0c3e9f',
          deal: '#d85b78',
          prime: '#50b8eb',
          green: '#188b6f',
          greenDark: '#0d755c',
          red: '#c94f68',
          star: '#f3b64c',
        },
        aurora: {
          ink: '#07152f',
          cyan: '#73e4c2',
          violet: '#9d8cff',
          sky: '#50b8eb',
          mist: '#eef3fb',
          line: '#d9e3f1',
        },
      },
      fontFamily: {
        amazon: ['"Amazon Ember"', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        card: '0 10px 30px rgba(7,21,47,0.06)',
        cardHover: '0 18px 46px rgba(7,21,47,0.14)',
        header: '0 12px 30px rgba(7,21,47,0.16)',
        glow: '0 0 0 1px rgba(115,228,194,.22), 0 14px 40px rgba(44,91,180,.15)',
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
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
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
