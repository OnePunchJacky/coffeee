/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        espresso: {
          50:  '#FAF7F2',
          100: '#F5ECD9',
          200: '#E8D4B4',
          300: '#D4B08A',
          400: '#C0783C',
          500: '#A0622E',
          600: '#7A4520',
          700: '#5C3318',
          800: '#3D1C02',
          900: '#2C1810',
          950: '#1A0A00',
        },
        cream: {
          50:  '#FAFAF8',
          100: '#F5F0E8',
          200: '#EDE4D5',
        },
        caramel: {
          300: '#D4A05A',
          400: '#C67B2A',
          500: '#A86520',
        },
      },
    },
  },
  plugins: [],
};
