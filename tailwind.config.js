/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // Ensure this matches your src/app structure
  ],
  theme: {
    extend: {
      colors: {
        gigswall: '#10ca00', // your green theme
      },
      scrollBehavior: ['responsive'],
      keyframes: {
        fadeInUpStrong: {
          '0%': { opacity: '0', transform: 'translateY(60px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeInUpStrong: 'fadeInUpStrong 1.2s ease-out forwards',
      },
      fontFamily: {
        bricolage: ['var(--font-bricolage)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
