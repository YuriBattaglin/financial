<script setup lang="ts">
import { MoonIcon } from 'vue-tabler-icons';
import { useTheme } from "vuetify";
import { ref, computed, watch } from "vue";

const theme = useTheme();
const savedTheme = localStorage.getItem("theme") || "DarkTheme";

// Aplica o tema salvo
theme.global.name.value = savedTheme;

// Computed para exibir o nome do tema atual no botão
const currentTheme = computed(() => theme.global.name.value);

// Função para alternar entre temas
const toggleTheme = () => {
  const newTheme = theme.global.name.value === "LightTheme" ? "DarkTheme" : "LightTheme";
  theme.global.name.value = newTheme;
  localStorage.setItem("theme", newTheme);
};
</script>
<template>
    <v-btn icon variant="text"  class="custom-hover-success ml-0 ml-md-5 text-muted" @click="toggleTheme">
        <v-badge dot color="dark" offset-x="-5" offset-y="-3" >
            <MoonIcon stroke-width="1.5" size="22" />
        </v-badge>
    </v-btn>
</template>
