import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

const DEFAULT_BACKEND_PORT = 3099;
const BACKEND_PORT_CONFIG = path.resolve(__dirname, '../backend/port-config.json');

const getBackendPort = () => {
  try {
    if (fs.existsSync(BACKEND_PORT_CONFIG)) {
      const configRaw = fs.readFileSync(BACKEND_PORT_CONFIG, 'utf8');
      const config = JSON.parse(configRaw);
      if (config.port) {
        console.log(`[vite] 读取到后端端口配置: ${config.port}`);
        return config.port;
      }
    }
  } catch (err) {
    console.warn('[vite] 读取后端端口配置失败，使用默认端口:', err.message);
  }
  return DEFAULT_BACKEND_PORT;
};

const backendPort = getBackendPort();

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: `http://localhost:${backendPort}`,
        changeOrigin: true
      },
      '/uploads': {
        target: `http://localhost:${backendPort}`,
        changeOrigin: true
      }
    }
  }
});
