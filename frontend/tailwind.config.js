/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'plant-green': '#22c55e',
        'leaf-green': '#16a34a',
        'earth-brown': '#a3a3a3',
        'nature-beige': '#f5f5dc',
      },
    },
  },
  plugins: [],
}