// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  typescript: {
    shim: false
  },
  build: {
    transpile: ["vuetify"],
  },
  vite: {
    define: {
      "process.env.DEBUG": false,
    },
    server: {
      hmr: {
        clientPort: 3000,  // Defina outra porta se necessário
        protocol: 'ws',    // Certifique-se de que o protocolo esteja correto
      }
    }
  },
  nitro: {
    serveStatic: true,
  },
  devServerHandlers: [],
})


