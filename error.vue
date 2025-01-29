<script setup lang="ts">
import { ref } from 'vue';

// Página de título
const title = ref("404-Page Not Found");
useHead({
  meta: [{ content: title }],
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk}` : "Finantial";
  },
});

const savedTheme = localStorage.getItem("theme") || "DarkTheme"; 
</script>

<template>
  <div v-if="savedTheme === 'DarkTheme'" class="d-flex v-application justify-center align-center text-center h-100vh" style="background-color: #121212; color: white;">
    <div>
      <img src="/images/background/errorGif.gif" width="500" alt="404" />
      <h1 class="text-h1 pt-3">Opps!!!</h1>
      <p class="my-8">This page you are looking for could not be found.</p>
      <v-btn flat color="success" class="mb-4" to="/">Go Back to Home</v-btn>
    </div>
  </div>
  <div v-else class="d-flex v-application justify-center align-center text-center h-100vh">
    <div>
      <img src="/images/background/errorGif.gif" width="500" alt="404" />
      <h1 class="text-h1 pt-3">Opps!!!</h1>
      <p class="my-8">This page you are looking for could not be found.</p>
      <v-btn flat color="success" class="mb-4" to="/">Go Back to Home</v-btn>
    </div>
  </div>
</template>
