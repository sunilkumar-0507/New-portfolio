import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        // Vendor chunks for the eager UI; the 3D stack is split off by the lazy import.
        manualChunks(id: string) {
          if (!id.includes("node_modules")) return undefined
          if (/[\/]node_modules[\/](react|react-dom|scheduler)[\/]/.test(id)) return "react"
          if (/[\/]node_modules[\/](gsap|@gsap|lenis)[\/]/.test(id)) return "motion"
          if (/[\/]node_modules[\/](framer-motion|motion-dom|motion-utils)[\/]/.test(id)) return "framer"
          // Everything else (three, R3F, drei, postprocessing…) follows the lazy HeroScene import.
          return undefined
        },
      },
    },
  },
})
