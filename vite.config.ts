import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Charger les variables d'environnement du mode actuel
  const env = loadEnv(mode, process.cwd(), 'VITE_');

  return {
    server: {
      host: "::",
      port: 3000, // Port du frontend
      proxy: {
        // Rediriger les requêtes /api vers le backend Spring Boot
        '/api': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          // Nous n'avons pas besoin de 'rewrite' ici car nos endpoints backend commencent déjà par '/api'
          // Par exemple, /api/vehicules sera proxyfié vers http://localhost:8080/api/vehicules
        },
      },
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
