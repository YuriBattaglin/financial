<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router'; 
import UiParentCard from '@/components/shared/UiParentCard.vue';

const form = ref<HTMLFormElement | null>(null);
const description = ref('');
const selectedIcon = ref('mdi-lightbulb-question');  
const isEditing = ref(false);  
const currentId = ref('');  
const route = useRoute();  
const loggedUser = JSON.parse(localStorage.getItem('loggedUser') || '{}');
const Snackbar = inject('Snackbar') as (msg: string, type?: string) => void;

const iconOptions = ref([
    { label: 'Others', icon: 'mdi-lightbulb-question' },
    { label: 'Home', icon: 'mdi-home' },
    { label: 'School', icon: 'mdi-school' },
    { label: 'Family', icon: 'mdi-account-group' },
    { label: 'Personal', icon: 'mdi-account' },
    { label: 'Transport', icon: 'mdi-car' },
    { label: 'Supermarket', icon: 'mdi-cart' },
    { label: 'Leisure', icon: 'mdi-movie' },
    { label: 'Health', icon: 'mdi-heart' },
    { label: 'Food', icon: 'mdi-food' },
    { label: 'Investments', icon: 'mdi-currency-usd' },
    { label: 'Loans', icon: 'mdi-bank' },
    { label: 'Insurance', icon: 'mdi-shield' }
]);

const getUsedIcons = () => {
    const existingData = localStorage.getItem('groups');
    const allData = existingData ? JSON.parse(existingData) : [];
    const usedIcons = new Set(allData.map(item => item.icon));  
    return usedIcons;
};

const usedIcons = ref(new Set());

const descriptionRules = (value) => {
    if (!value) return 'Description is required!';
    return true;
};

const generateUniqueId = () => {
    return `id-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

const submitForm = () => {
    try {
        const descriptionValid = descriptionRules(description.value) === true;

        if (descriptionValid) {
            const formData = {
                id: isEditing.value ? currentId.value : generateUniqueId(),  
                description: description.value,
                icon: selectedIcon.value,  
                user_id: loggedUser.id
            };

            const existingData = localStorage.getItem('groups');
            let allData = existingData ? JSON.parse(existingData) : [];

            if (isEditing.value) {
                const index = allData.findIndex(item => item.id === currentId.value);
                if (index !== -1) {
                    allData[index] = formData;  
                }
            } else {
                allData.push(formData);  
            }

            localStorage.setItem('groups', JSON.stringify(allData));

            Snackbar('Data sent successfully!', 'success');
            usedIcons.value.add(selectedIcon.value);
            form.value?.reset();
            description.value = '';
            selectedIcon.value = 'mdi-lightbulb-question';
            navigateTo('/groups/list', { replace: true });
        }
    } catch (error) {
        console.error('Error saving group:', error);
    }
};


onMounted(() => {
    const idParam = route.query.id as string;  
    const usedIconsSet = getUsedIcons();
    usedIcons.value = usedIconsSet;
    if (idParam) {
        const existingData = localStorage.getItem('groups');
        const allData = existingData ? JSON.parse(existingData) : [];
        const itemToEdit = allData.find(item => item.id === idParam && item.user_id === loggedUser.id);
        if (itemToEdit) {
            description.value = itemToEdit.description;
            selectedIcon.value = itemToEdit.icon || 'mdi-lightbulb-question';  
            currentId.value = idParam;
            isEditing.value = true;  
        }
    }

    useHead({
        title: isEditing.value ? "Editing group - Finantial Controller" : "Registering group - Finantial Controller",
    });
    definePageMeta({
        middleware: 'auth',
    });
});

</script>

<template>
    <v-form ref="form" @submit.prevent="submitForm" class="d-flex flex-column h-100">
        <v-row>
            <v-col cols="12" md="12">
                <UiParentCard title="Register group">
                    <div class="pa-7 pt-1 flex-grow-1">
                        <v-text-field v-model="description" maxlength="25" label="Description"
                            :rules="[descriptionRules]" required :prepend-icon="selectedIcon" />

                        <v-label class="font-weight-bold">Group Icon:</v-label> <!-- Melhorado com estilo -->
                        <v-row justify="space-evenly mt-2">
                            <v-col v-for="(icon, index) in iconOptions" :key="index" cols="auto">
                                <v-btn @click="selectedIcon = icon.icon"
                                    :class="{ 'v-btn--active': selectedIcon === icon.icon }"
                                    :disabled="icon.icon !== 'mdi-lightbulb-question' && usedIcons.has(icon.icon)"
                                    color="transparent">
                                    <v-icon :icon="icon.icon" size="25px"></v-icon>
                                    <span class="ms-1">{{ icon.label }}</span>
                                </v-btn>
                            </v-col>
                        </v-row>
                    </div>
                </UiParentCard>
            </v-col>
        </v-row>
        <v-footer app>
            <v-toolbar flat style="background-color: transparent;">
                <v-btn icon variant="text" size="x-large" @click="navigateTo('/groups/list'), { replace: true }">
                    <v-icon>mdi-arrow-left</v-icon>
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn icon variant="tonal" size="x-large" type="submit" color="success">
                    <v-icon>mdi-check</v-icon>
                </v-btn>
            </v-toolbar>
        </v-footer>
    </v-form>
</template>