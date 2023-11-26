/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      animation: {
        shrink: 'shrink 0.15s',
        rotate: 'rotate 1.5s linear infinite',
      },
      keyframes: {
        shrink: {
          '0%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' }
        },
        rotate: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      colors: {
        background: '#e6e6e6',
        darkOrange: '#c2410c',
        normalOrange: '#e05f28',
      },
      backgroundImage: {
        'pizza': "url('src/assets/Pizza-bg.jpg')",
        'darkPizza': "url('src/assets/Pizza-bg-2.jpg')"
      }
    },
  },
  plugins: [],
}