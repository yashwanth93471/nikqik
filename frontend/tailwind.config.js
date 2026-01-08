/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#4a1d4b',
        'primary-light': '#6a2c6b',
        'accent': '#ff7062',
        'accent-hover': '#e86356',
      },
      boxShadow: {
        'coral-500/20': '0 10px 20px rgba(255, 112, 98, 0.2)',
        'coral-500/30': '0 10px 20px rgba(255, 112, 98, 0.3)',
        'purple-500/20': '0 10px 20px rgba(74, 29, 75, 0.2)',
        'green-500/20': '0 10px 20px rgba(39, 174, 96, 0.2)',
      },
    },
  },
  plugins: [],
}
