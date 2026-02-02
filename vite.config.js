import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages: REPO_NAME 미설정 시 '/' (로컬), CI에서 REPO_NAME=youtubDisLikeSearch 사용
// 배포 URL: https://kimchunyong.github.io/youtubDisLikeSearch/
const repositoryName = process.env.REPO_NAME || '';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: repositoryName ? `/${repositoryName}/` : '/',
  build: {
    outDir: 'dist',
  },
  server: {
    proxy: {
      // Return YouTube Dislike API CORS 우회 (개발 시에만)
      '/api/ryd': {
        target: 'https://returnyoutubedislikeapi.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ryd/, '/api'),
      },
    },
  },
});
