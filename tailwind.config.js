module.exports = {
  important:true,
  purge: {
    content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
    options: {
      safelist: [/^bg/],
    }
  },
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
