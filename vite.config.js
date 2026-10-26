import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import fs from 'fs';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync('./src/certs/server.key'),
      cert: fs.readFileSync('./src/certs/server.crt'),
    },
    port: 5173,
  }
})
