import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import tailwindcss from "tailwindcss";


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()
  ],
  test: {
   
      globals: true,
      environment: 'jsdom',
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname,"./src"),
    },
    css: {
      postcss: {
        plugins: [tailwindcss()],
      },
    },
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3000' // Proxy to Backend
    }
  }

})
