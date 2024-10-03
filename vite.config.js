import { fileURLToPath, URL } from "url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  define: {
    __VUE_OPTIONS_API__: true, // Habilita la API de opciones (puedes poner false si no la usas)
    __VUE_PROD_DEVTOOLS__: false, // Deshabilita las herramientas de desarrollo en producción
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false // Deshabilita los detalles de desajuste de hidratación en producción
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    host: true,
  },
});
