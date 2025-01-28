<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { useTheme } from 'vuetify';

// Página de título
const title = ref("404-Page Not Found");
useHead({
  meta: [{ content: title }],
  titleTemplate: (titleChunk) => {
    return titleChunk
      ? `${titleChunk}`
      : "Finantial";
  },
});

// Controle de tema
const theme = useTheme();
const savedTheme = localStorage.getItem("theme") || "DefaultTheme"; // Pega 'DefaultTheme' caso não tenha no localStorage
const isDarkTheme = ref(savedTheme === "DarkTheme");

theme.global.name.value = isDarkTheme.value ? "DarkTheme" : "DefaultTheme"; // Define o tema inicial
</script>

<template>
  <div class="d-flex justify-center align-center text-center h-100vh">
    <div>
      <img src="/images/background/errorimg.svg" width="500" alt="404" />
      <h1 class="text-h1 pt-3">Opps!!!</h1>
      <p class="my-8">This page you are looking for could not be found.</p>
      <v-btn flat color="success" class="mb-4" to="/">Go Back to Home</v-btn>
    </div>
  </div>
</template>

<style scoped>
/* Estilos para o tema claro e escuro */
body {
  transition: background-color 0.3s ease;
}

.v-application--light {
  background-color: #f5f5f5;
}

.v-application--dark {
  background-color: #333333;
  color: #ffffff;
}
</style>
