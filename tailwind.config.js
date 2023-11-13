/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      animation: {
        shrink: 'shrink 0.15s'
      },
      keyframes: {
        shrink: {
          '0%': { transform: 'scale(0.92)' },
          '100%': { transform: 'scale(1)' }
        }
      },
      colors: {
        background: '#e6e6e6',
      }
    },
  },
  plugins: [],
}

