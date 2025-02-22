<script setup lang="ts">
const props = defineProps({
    title: String,
    class:String
});
</script>

// ===============================|| Ui Parent Card||=============================== //
<template>
    <h5 class="text-h4 mb-6">{{ title }}</h5>
    <v-card elevation="10" class="withbg">
        <v-card-item class="pa-0 pt-7">
            <div class="d-sm-flex align-center justify-space-between">
                <slot name="action"></slot>
            </div>

            <slot />
        </v-card-item>
       
    </v-card>
</template>
