/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{jsx,tsx}',
    './src/screens/**/*.{jsx,tsx}',
    './src/components/**/*.{jsx,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {},
  },
  plugins: [],
};
