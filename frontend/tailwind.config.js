/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        // Function Health inspired color palette
        primary: {
          DEFAULT: '#B85C38',
          // light: '#D4845F',
          light: '#E8D5C4',
          dark: '#8B4328',
        },
        secondary: {
          DEFAULT: '#E8D5C4',
          light: '#F5EDE5',
          dark: '#D4BDA9',
        },
        background: {
          DEFAULT: '#F8F4F0',
          dark: '#E8E0D8',
        },
        terracotta: '#B85C38',
        cream: '#F8F4F0',
        beige: '#E8D5C4',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  plugins: [],
}