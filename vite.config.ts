import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      // 🚫 CORREÇÃO: Impede o Vite de reiniciar o projeto quando o banco atualizar
      ignored: ['**/db.json'],
    },
  },
});