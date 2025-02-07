<!-- components/shared/Snackbar.vue -->
<script setup lang="ts">
import { ref } from 'vue';

const snackbar = ref(false);
const message = ref('');
const color = ref('success');

const showSnackbar = (msg: string, type: string = 'success') => {
    message.value = msg;
    color.value = type;
    snackbar.value = true;
};

defineExpose({ showSnackbar });
</script>

<template>
    <v-snackbar v-model="snackbar" timeout="3000" :color="color" location="top right" elevation="12" variant="elevated"
        height="80px" min-height="60px" max-width="300px" transition="slide-x-reverse-transition" >
        <div style="display: flex; align-items: center;">
            <v-icon left size="30" v-if="color === 'success'" color="white">mdi-check</v-icon>
        <v-icon left size="30" v-if="color === 'error'" color="white">mdi-alert</v-icon>
        <v-icon left size="30" v-if="color === 'warning'" color="white">mdi-alert</v-icon>
        <v-icon left size="30" v-if="color === 'info'" color="white">mdi-information</v-icon>
            <h3
                style="margin: 0; font-size: 16px; font-weight: bold; color: white; display: inline-block; margin-left: 10px;">
                {{ message }}
            </h3>
        </div>
    </v-snackbar>
</template>