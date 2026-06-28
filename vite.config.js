import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      // 프론트에서 /api로 시작하는 요청을 감지하면 아래 target 서버로 대리 전송합니다.
      '/api': {
        target: 'http://localhost:8080', // 백엔드 서버 주소
        changeOrigin: true,
      }
    }
  }
})
