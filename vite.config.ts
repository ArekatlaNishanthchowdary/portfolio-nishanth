import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Set base to your GitHub repo name, e.g. '/portfolio-nishanth/'
// If deploying to a custom domain or user/org page (username.github.io), set base to '/'
export default defineConfig({
  plugins: [react()],
  base: '/portfolio-nishanth/',
})
