/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0B0F1A', // Deep neutral dark
          blue: '#3B82F6', // Primary Blue
          blueLight: '#60A5FA',
          green: '#10B981', // Primary Green
          greenLight: '#34D399',
        }
      },
      borderRadius: {
        'beat': '1.25rem', // Extra rounded for the "playful" feel
      },
      boxShadow: {
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.15)',
        'glow-green': '0 0 20px rgba(16, 185, 129, 0.15)',
      }
    },
  },
  plugins: [],
}
