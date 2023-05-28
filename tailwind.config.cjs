/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'primary': '#172031',
        'accent' : '#333F54',
        'alt' : '#00A990',
        'background-main': '#F9F9ED',
        'primary-text': '#FFFFFF',
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar')({ nocompatible: true }),
  ],
};
