import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import polyfillNode from 'rollup-plugin-polyfill-node';

// https://vitejs.dev/config/
const viteConfig = ({ mode }: any) => {
  process.env = { ...process.env, ...loadEnv(mode, '', '') };
  return defineConfig({
    plugins: [react()],
    optimizeDeps: {
      esbuildOptions: {
        define: {
          global: 'globalThis',
        },
        plugins: [
          NodeGlobalsPolyfillPlugin({
            process: true,
            buffer: true,
          }),
        ],
      },
    },
    server: {
      proxy: {
        '/surge-proxy': {
          target: 'https://surge.surge.sh',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/surge-proxy/, ''),
        },
      },
    },
    build: {
      rollupOptions: {
        plugins: [polyfillNode()],
      },
      // manifest: 'manifest.json',
    },
  });
};

export default viteConfig;
