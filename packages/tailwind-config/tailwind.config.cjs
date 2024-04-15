/* eslint-disable @typescript-eslint/naming-convention */
/** @type {import("tailwindcss").Config} */
module.exports = {
  content: [
    '../../ui/pos/src/**/*.{ts,tsx}',
    '../../apps/pos/src/index.html',
  ],
  safelist: [
    'lg:bg-red-dark',
    'lg:bg-blue-royal',
    'lg:bg-blue-default',
    'lg:bg-green-default',
    'lg:bg-turquoise-default',
    'lg:bg-pink-default',
    'lg:bg-cream',
  ],
  theme: {
    extend: {
      screens: {
        lg: '1205px',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      colors: {
        brand: {
          DEFAULT: "rgb(0, 0, 76)",
        },
        red: {
          DEFAULT: "rgb(255, 218, 205)",
          darker: "#880808",
        },
        yellow: {
          DEFAULT: "#FFFAEE",
        },
        brown: {
          DEFAULT: "#3e320e",
        },
        white: "rgb(255, 255, 255)",
      },
      fontSize: {
        base: "1rem",
        lg: "1.5rem",
        xl: "2rem",
      },
      keyframes: {
        slide: {
          '0%': {
            transform: 'translateX(500px)',
          },

          '50%': {
            transform: 'translateX(250px)',
          },

          '100%': {
            transform: 'translateX(0px)',
          },
        },
      },
      margin: {
        15: '60px',
      },
      padding: {
        15: '60px',
      },
    },
  },
  plugins: [],
};
