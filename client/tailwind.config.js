module.exports = {
  important:true,
  purge: {
    content: ['./pages/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
    options: {
      safelist: [/^bg/],
    }
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      minHeight: {
        '1/2': '50%',
        '2/5-screen': '40vh',
        '3/5-screen': '60vh',
      },
      inset: {
        "-board": "-6vw", // = half of tile width
        "-sm-board": "-34px", // = half of tile width
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
        'desktop': "660px",
        'tile': "6vw",
        'sm-tile':"40px",
        'tooltip': "90vw",
        'sm-tooltip': "600px",
      },
      height: {
        'tile': "5vw",
        'sm-tile': "32px",
        '2/5-screen': '40vh',
        '3/5-screen': '60vh',

      },
      colors: {
        teal: {
          300: "#5EEAD4",
          500: "#14B8A6"

        },
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
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
