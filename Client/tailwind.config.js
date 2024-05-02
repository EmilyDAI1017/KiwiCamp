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


module.exports = {
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#a7f3d0",
          "secondary": "#a7f3d0",
          "accent": "#00ffff",
          "neutral": "#99f6e4",
          "base-100": "#ffffff",
          "info": "#22d3ee",
          "success": "#4ade80",
          "warning": "#fde68a",
          "error": "#fb7185",
        },
      },
    ],
  },
  plugins: [
    require('daisyui'),
  ],
}
