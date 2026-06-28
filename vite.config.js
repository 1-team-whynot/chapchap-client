import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // 여기에 실제 백엔드 서버 주소를 넣으세요
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
