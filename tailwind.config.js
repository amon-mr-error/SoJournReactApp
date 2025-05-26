/** @type {import('tailwindcss').Config} */
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sojourn-green': '#004D40', // The deep green from your logo
        'sojourn-cream': '#FFFDE7', // The cream/off-white from your logo
        'sojourn-teal': '#00796B', // A complementary teal color
        'sojourn-blue': '#0277BD', // A blue for water elements
        'sojourn-gray': '#455A64', // A slate gray for text
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Montserrat', 'sans-serif'],
      },
      backgroundImage: {
        'mountain-lake': "url('../assets/images/mountain-lake.jpg')",
        'mountain-meadow': "url('../assets/images/mountain-meadow.jpg')",
      },
    },
  },
  plugins: [],
}

