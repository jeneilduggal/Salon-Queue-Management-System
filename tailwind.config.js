/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          50: '#FAF8F3',
          100: '#F4F0E7', // Primary Warm Ivory
          200: '#EBE5D6',
          300: '#DFD7C1',
          400: '#CFC3A4',
          500: '#B8A882',
        },
        forest: {
          50: '#F1F6F4',
          100: '#DDE9E4',
          200: '#BDD5CC',
          300: '#93B9AC',
          400: '#649685',
          500: '#3A7463',
          600: '#265749',
          700: '#1F473C',
          800: '#183C32', // Primary Deep Forest Green
          900: '#122D26',
          950: '#0A1B16',
        },
        copper: {
          50: '#FBF5F1',
          100: '#F5E7DF',
          200: '#ECCDC0',
          300: '#DEAC98',
          400: '#CD866F',
          500: '#B47752', // Primary Muted Copper
          600: '#9E5F3D',
          700: '#834C31',
          800: '#6C3E2A',
          900: '#5A3525',
        },
        charcoal: {
          50: '#F6F6F6',
          100: '#E7E7E7',
          200: '#D1D2D1',
          300: '#B0B1B0',
          400: '#878987',
          500: '#676967',
          600: '#4E504E',
          700: '#3A3C3A',
          800: '#242724', // Primary Charcoal
          900: '#1B1D1B',
          950: '#111311',
        },
        sage: {
          50: '#F4F6F3',
          100: '#E7EBE5',
          200: '#D2D9CE',
          300: '#B6C3B1',
          400: '#A6B3A0', // Primary Soft Sage
          500: '#8A9983',
          600: '#6D7C66',
          700: '#566250',
          800: '#454E41',
          900: '#3B4337',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(24, 60, 50, 0.08), 0 0 1px 1px rgba(24, 60, 50, 0.05)',
        'luxury-hover': '0 25px 50px -12px rgba(24, 60, 50, 0.16), 0 0 1px 1px rgba(180, 119, 82, 0.2)',
        'copper-glow': '0 10px 25px -5px rgba(180, 119, 82, 0.25)',
      }
    },
  },
  plugins: [],
}
