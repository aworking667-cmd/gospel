import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FBF6E9', 100: '#F5EAC8', 200: '#EBD49B', 300: '#DDB85F',
          400: '#C99A3A', 500: '#A87D26', 600: '#8A6420', 700: '#6B4D1A',
          800: '#4D3812', 900: '#2E2209',
        },
        ink: {
          50: '#E8ECF1', 100: '#C5CCD8', 200: '#9BA5B5', 300: '#6E7A8E',
          400: '#4D5A6E', 500: '#33405A', 600: '#1F2A40', 700: '#132036',
          800: '#0B1626', 900: '#05070D',
        },
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
