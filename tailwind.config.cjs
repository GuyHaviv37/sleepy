/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'primary': '#252B3D',
        'accent' : '#3772FF',
        'alt' : '#645DD7',
        'background-main': '#F9F9ED',
        'primary-text': '#FFFFFA',
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar')({ nocompatible: true }),
  ],
};
