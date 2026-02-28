import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  // Load environment variables based on the current mode (development/production)
  const env = loadEnv(mode, process.cwd(), '');

  return {
    define: {
      // এখানে GEMINI_API_KEY বদলে VITE_GEMINI_API_KEY করে দিলাম 
      // যাতে এটি রেন্ডারের ভেরিয়েবলের সাথে মিলে যায়
      'process.env.API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY),
    },
    server: {
      port: 5173,
      open: true,
    },
  };
});