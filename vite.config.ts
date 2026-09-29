import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three') || id.includes('@react-three') || id.includes('node_modules/postprocessing')) return 'three'
          if (id.includes('node_modules/gsap') || id.includes('node_modules/motion') || id.includes('node_modules/framer-motion') || id.includes('node_modules/lenis')) return 'motion'
        },
      },
    },
  },
})
