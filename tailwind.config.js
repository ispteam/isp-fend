module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily:{
        Raleway: ["Raleway"]
      },
      margin:{
        mlh: "0.10rem"
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
