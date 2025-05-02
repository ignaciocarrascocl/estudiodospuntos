/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'dp-blue': '#3030D0',
        'dp-red': '#FF4B00',
        'dp-pink': '#FF97D6',
        'dp-green': '#00DEB5',
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
