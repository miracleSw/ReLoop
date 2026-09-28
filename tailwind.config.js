/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        eco: {
          50: '#F3F7F3',
          100: '#E3EDE3',
          200: '#C7DBC8',
          300: '#A1C3A3',
          400: '#73A577',
          500: '#4F8854',
          600: '#3C6D41',
          700: '#2F5534',
          800: '#254329',
          900: '#1E3722',
          950: '#0D1C10',
        },
        clay: {
          50: '#FDF7F4',
          100: '#FBEDE6',
          200: '#F5DACD',
          300: '#EABFAD',
          400: '#DD9980',
          500: '#C87253',
          600: '#B85838',
          700: '#994429',
          800: '#7E3A25',
          900: '#663223',
        },
        sand: {
          50: '#FBFBFA',
          100: '#F5F4F0',
          200: '#ECE9E2',
          300: '#DDD8CD',
          400: '#C5BDAF',
          500: '#A99F90',
          600: '#8A8072',
          700: '#6A6256',
          800: '#4C463D',
          900: '#2F2B26',
        },
        charcoal: {
          900: '#141C15',
          800: '#1E281F',
          700: '#2C3A2E',
          600: '#435445',
          500: '#5F7362',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        editorial: ['"Newsreader"', '"Playfair Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'soft': '0 2px 10px -2px rgba(20, 28, 21, 0.05)',
        'card': '0 8px 30px -6px rgba(20, 28, 21, 0.07)',
        'elevated': '0 16px 40px -10px rgba(20, 28, 21, 0.12)',
        'subtle': '0 1px 3px 0 rgba(20, 28, 21, 0.04)',
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-subtle': 'pulseSubtle 3s infinite ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        }
      }
    },
  },
  plugins: [],
}
