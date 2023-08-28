/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'primary': '#172031',
        'accent' : '#333F54',
        'secondary-accent': '#576172',
        'alt' : '#00A990',
        'background-main': '#F9F9ED',
        'primary-text': '#FFFFFF',
      },
      fontFamily: {
        'sans': ['Nunito Sans', ...defaultTheme.fontFamily.sans]
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar')({ nocompatible: true }),
  ],
};
