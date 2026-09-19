/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          900: '#312E81',
        },
        dark: {
          bg: '#0B0E14',
          card: '#121721',
          cardHover: '#18202E',
          panel: '#151C28',
          border: '#1E2633',
          borderLight: '#2A364F',
          muted: '#8B98A5',
          text: '#F1F5F9',
        },
        profit: {
          DEFAULT: '#10B981',
          light: '#34D399',
          dark: '#065F46',
          bg: 'rgba(16, 185, 129, 0.10)',
          border: 'rgba(16, 185, 129, 0.25)',
        },
        loss: {
          DEFAULT: '#EF4444',
          light: '#F87171',
          dark: '#991B1B',
          bg: 'rgba(239, 68, 68, 0.10)',
          border: 'rgba(239, 68, 68, 0.25)',
        },
        warning: {
          DEFAULT: '#F59E0B',
          bg: 'rgba(245, 158, 11, 0.10)',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'glow-profit': '0 0 20px -3px rgba(16, 185, 129, 0.3)',
        'glow-loss': '0 0 20px -3px rgba(239, 68, 68, 0.3)',
        'glow-brand': '0 0 25px -5px rgba(99, 102, 241, 0.4)',
        'card-dark': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out forwards',
        'pulse-subtle': 'pulseSubtle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        }
      }
    },
  },
  plugins: [],
}
