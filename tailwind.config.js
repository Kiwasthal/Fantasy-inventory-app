/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.{ html,js,css}', './views/*.ejs', './views/partial/*.ejs'],
  theme: {
    extend: {
      fontFamily: {
        main: ['Dela Gothic One'],
        secondary: ['Pathway Gothic One'],
      },
    },
  },
  plugins: [],
};
