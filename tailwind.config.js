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
        // Design Tokens: Premium Editorial + Retro-Futurism
        ivory: '#F4F0E6',
        ink: {
          50: '#F6F6F5',
          100: '#ECEBE9',
          200: '#DCD6CA',
          300: '#A8A49C',
          400: '#77736B',
          700: '#383632',
          800: '#22211F',
          900: '#171717',
          950: '#121212',
          DEFAULT: '#171717',
        },
        vermilion: {
          50: '#FDF2F0',
          100: '#FCE3DE',
          200: '#F9C2B8',
          400: '#F57860',
          500: '#F05A3C',
          600: '#D94528',
          700: '#B83219',
          DEFAULT: '#F05A3C',
        },
        cobalt: {
          50: '#EEF4FF',
          100: '#DCE7FE',
          200: '#BDD2FD',
          400: '#4D7DFA',
          500: '#2457D6',
          600: '#1B44B0',
          700: '#14348A',
          DEFAULT: '#2457D6',
        },
        chartreuse: {
          50: '#FAFCE8',
          100: '#F3F8C5',
          300: '#DFEC72',
          500: '#C7D83D',
          600: '#A6B825',
          DEFAULT: '#C7D83D',
        },
        sand: {
          50: '#FAF8F3',
          100: '#F4F0E6',
          200: '#EAE5D9',
          300: '#DCD6CA',
          400: '#BDB6A8',
          500: '#77736B',
          DEFAULT: '#EAE5D9',
        },
        brand: {
          50: '#FDF2F0',
          100: '#FCE3DE',
          500: '#F05A3C',
          600: '#D94528',
          700: '#B83219',
          900: '#171717',
        }
      },
      fontFamily: {
        editorial: ['Newsreader', 'Georgia', 'serif'],
        serif: ['Newsreader', 'Georgia', 'serif'],
        display: ['Newsreader', 'Instrument Serif', 'Georgia', 'serif'],
        sans: ['Inter', 'Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 3px rgba(23, 23, 23, 0.04), 0 1px 2px rgba(23, 23, 23, 0.02)',
        'editorial': '0 4px 20px -2px rgba(23, 23, 23, 0.06)',
        'elevated': '0 10px 30px -4px rgba(23, 23, 23, 0.08)',
        'vermilion': '0 4px 14px 0 rgba(240, 90, 60, 0.25)',
        'cobalt': '0 4px 14px 0 rgba(36, 87, 214, 0.25)',
      }
    },
  },
  plugins: [],
}
