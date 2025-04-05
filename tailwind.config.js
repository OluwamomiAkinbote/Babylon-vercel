/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        sm: "368px",
        md: "776px",
        lg: "1024px", // Default lg size, can be adjusted if needed
      },
      fontFamily: {
        barlow: ["Barlow Condensed", "sans-serif"],
        futura: ["Futura Std", "sans-serif"],
        openSans: ["Open Sans", "sans-serif"],
        robotoCondensed: ["Roboto Condensed", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
