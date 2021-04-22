module.exports = {
  important:true,
  purge: ['./src/**/*.{js,jsx,ts,tsx}', "./src/components/**/*.{js,jsx,ts,tsx}", './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      maxWidth: {
        'card': "30rem"
      }
    },
  },
  variants: {
    extend: {
      zIndex: ['hover'],
    },
  },
  plugins: [],
}
