/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@material-tailwind/react/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        'forest': '#228B22',  // Forest green
        'sky': '#87CEEB',     // Sky blue
        'cream': '#F5F5F5'    // Off-white, creamy background
      }

      
    },
  },
  plugins: [
    'daisyui'
  ],
}

