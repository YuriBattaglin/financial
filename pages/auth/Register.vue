<script setup lang="ts">
/*-For Set Blank Layout-*/
definePageMeta({
  layout: "blank",
});
import { ref, onMounted } from 'vue';
import { useTheme } from "vuetify";

const isDarkTheme = ref(false);
onMounted(() => {
   const savedTheme = localStorage.getItem("theme") || "DefaultTheme"; 
  const theme = useTheme();
  isDarkTheme.value = savedTheme === "DarkTheme";
  theme.global.name.value = savedTheme;  // Aplica o tema globalmente
});
</script>
<template>
 <div :class="{'authentication': true, 'dark': isDarkTheme}">
        <v-container fluid class="pa-3">
            <v-row class="h-100vh d-flex justify-center align-center">
                <v-col cols="12" lg="4" xl="3" class="d-flex align-center">
                    <v-card rounded="md" elevation="10" class="px-sm-1 px-0 withbg mx-auto" max-width="500">
                        <v-card-item class="pa-sm-8">
                            <div class="d-flex justify-center py-4">
                                <LayoutFullLogo />
                            </div>
                            <div class="text-body-1 text-muted text-center mb-3">Your finance controller</div>
                            <AuthRegisterForm />
                            <h6 class="text-h6 text-muted font-weight-medium d-flex justify-center align-center mt-3">
                                Already have an Account?
                                <NuxtLink to="/auth/login"
                                    class="text-success text-decoration-none text-body-1 opacity-1 font-weight-medium pl-2">
                                    Sign In</NuxtLink>
                            </h6>
                        </v-card-item>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>
