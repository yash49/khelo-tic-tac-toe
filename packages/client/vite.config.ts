import react from '@vitejs/plugin-react';

import { defineConfig } from 'vite';

const arg = process.argv.find((arg) => arg.startsWith('VITE_SERVER_URL='));
const VITE_SERVER_URL = arg?.split('=')?.[1] ?? 'ws://localhost:8080';

// pnpm build -- VITE_SERVER_URL=xxxxxxxxx

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_SERVER_URL': `"${VITE_SERVER_URL}"`,
  },
});
