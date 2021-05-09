module.exports = {
  important:true,
  purge: {
    content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html', "./example/src/index.js"],
    options: {
      safelist: [/^bg/],
    }
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      inset: {
        "-board": "-6vw", // = half of tile width
        "-sm-board": "-30px", // = half of tile width
      },
      maxHeight: {
        'tooltip': "70vh",
        'tooltip-media': "40vh", // tooltip = media + text
        'tooltip-text': "30vh",
      },
      margin: {
        'tile': '2px',
        'sm-tile': '4px'
      },
      width: {
        'tile': "6vw",
        'sm-tile':"40px",
        'tooltip': "90vw",
        'sm-tooltip': "600px",
      },
      height: {
        'tile': "5vw",
        'sm-tile': "32px",
      },
      colors: {
        lime:{
          300: "#BEF264",
          500: "#84CC16"
        },
        brown: {
          300: "#FCD34D",
          500: "#F59E0B"
        }
      }
    }
  },
  variants: {
    extend: {
      zIndex: ['hover'],
    },
  },
  plugins: [],
}
