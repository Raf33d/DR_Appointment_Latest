/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        'primary':"#0F766E",
        'accent':"#E76F51",
        'ink':"#17313B",
        'mist':"#F3F7F6"
      },
      gridTemplateColumns:{
        'auto':'repeat(auto-fill, minmax(200px, 1fr))'
      }
    },
  },
  plugins: [],
}
