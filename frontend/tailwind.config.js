/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'bg-green-100',
    'bg-gradient-to-br',
    'from-green-50',
    'via-white',
    'to-amber-50',
    'from-green-600',
    'via-emerald-500',
    'to-green-800',
    'from-green-500',
    'to-emerald-600',
    'hover:from-emerald-600',
    'hover:to-green-700'
  ],
  theme: {
    extend: {
      colors: {
        'plant-green': '#10b981',
        'leaf-green': '#059669',
        'forest-green': '#065f46',
        'sage-green': '#6b7280',
        'earth-brown': '#92400e',
        'nature-beige': '#fef3c7',
        'soft-mint': '#ecfdf5',
        'deep-forest': '#064e3b',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Poppins', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'bounce-subtle': 'bounceSubtle 2s infinite',
      },
    },
  },
  plugins: [],
}