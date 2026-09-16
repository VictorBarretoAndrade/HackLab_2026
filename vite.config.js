import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// O GitHub Pages serve o site em https://<usuario>.github.io/<repo>/, entao o
// bundle precisa saber esse prefixo. O workflow em .github/workflows/deploy.yml
// define VITE_BASE automaticamente a partir do nome do repositorio — nada para
// editar aqui. Local (npm run dev) cai no '/' do fallback.
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
