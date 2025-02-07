<script setup lang="ts">
import { ref, provide } from 'vue';
import Snackbar from '@/components/shared/Snackbar.vue';

const snackbarRef = ref<InstanceType<typeof Snackbar> | null>(null);
const title = ref("Finantial");
useHead({
    meta: [{ content: title }],
    titleTemplate: (titleChunk) => {
        return titleChunk
            ? `${titleChunk}`
            : "Finantial";
    },
});


const showGlobalSnackbar = (msg: string, type: string = 'success') => {
    snackbarRef.value?.showSnackbar(msg, type);
};

provide('Snackbar', showGlobalSnackbar);
</script>

<template>
    <v-locale-provider>
        <v-app>
            <LayoutFullMain />
            <v-main>
                <v-container fluid class="page-wrapper">
                    <div class="maxWidth">
                        <Snackbar ref="snackbarRef" />

                        <NuxtPage />
                    </div>
                </v-container>
            </v-main>
        </v-app>
    </v-locale-provider>
</template>
