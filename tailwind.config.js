/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Halozon design tokens (legacy `amazon-*` class names map here)
        amazon: {
          navy: '#1e1b4b',
          navylight: '#4338ca',
          navyxlight: '#6366f1',
          orange: '#ec4899',
          orangelight: '#f472b6',
          orangedark: '#fbcfe8',
          yellow: '#06b6d4',
          yellowHover: '#0891b2',
          buy: '#8b5cf6',
          buyHover: '#7c3aed',
          bg: '#f1f5f9',
          panel: '#ffffff',
          border: '#e2e8f0',
          borderDark: '#cbd5e1',
          text: '#0f172a',
          textMuted: '#64748b',
          link: '#7c3aed',
          linkHover: '#db2777',
          deal: '#f43f5e',
          prime: '#0ea5e9',
          green: '#10b981',
          greenDark: '#059669',
          red: '#ef4444',
          star: '#fbbf24',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        amazon: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(15, 23, 42, 0.06), 0 8px 24px rgba(99, 102, 241, 0.08)',
        cardHover: '0 12px 40px rgba(124, 58, 237, 0.18)',
        header: '0 4px 24px rgba(15, 23, 42, 0.08)',
        glow: '0 0 0 1px rgba(139, 92, 246, 0.15), 0 8px 32px rgba(236, 72, 153, 0.12)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
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
          '0%': { boxShadow: '0 0 0 0 rgba(139,92,246,.45)' },
          '70%': { boxShadow: '0 0 0 12px rgba(139,92,246,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(139,92,246,0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s linear infinite',
        fadeIn: 'fadeIn .35s ease-out both',
        slideDown: 'slideDown .25s ease-out both',
        scaleIn: 'scaleIn .2s ease-out both',
        pulseRing: 'pulseRing 1.6s cubic-bezier(0.4,0,0.6,1) infinite',
        marquee: 'marquee 30s linear infinite',
        float: 'float 4s ease-in-out infinite',
      },
      backgroundImage: {
        'hz-gradient': 'linear-gradient(135deg, #6366f1 0%, #ec4899 50%, #06b6d4 100%)',
        'hz-gradient-soft': 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(236,72,153,0.12) 50%, rgba(6,182,212,0.12) 100%)',
      },
    },
  },
  plugins: [],
};
