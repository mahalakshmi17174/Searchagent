import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      // Ignore locked/busy video files in project root (e.g. WhatsApp videos)
      ignored: ['**/*.mp4', '!**/src/**/*.mp4', '!**/public/**/*.mp4'],
    },
  },
})
