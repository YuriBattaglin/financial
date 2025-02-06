<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';  // Importa useRoute e useRouter
import UiParentCard from '@/components/shared/UiParentCard.vue';

const form = ref<HTMLFormElement | null>(null);
const description = ref('');
const selectedIcon = ref('mdi-lightbulb-question');  // Variável para armazenar o ícone selecionado
const snackbar = ref(false);
const isEditing = ref(false);  // Nova variável para determinar se é modo de edição
const currentId = ref('');  // ID do item que será editado
const route = useRoute();  // Para acessar os parâmetros da URL
const loggedUser = JSON.parse(localStorage.getItem('loggedUser') || '{}');

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

// Função para verificar se o ícone já foi usado
const getUsedIcons = () => {
    const existingData = localStorage.getItem('groups');
    const allData = existingData ? JSON.parse(existingData) : [];
    const usedIcons = new Set(allData.map(item => item.icon));  // Cria um conjunto com os ícones usados
    return usedIcons;
};

// Filtra os ícones que já foram usados
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
        // Validação da descrição
        const descriptionValid = descriptionRules(description.value) === true;

        if (descriptionValid) {
            const formData = {
                id: isEditing.value ? currentId.value : generateUniqueId(),  // Gera ID único ou usa o ID atual se estiver editando
                description: description.value,
                icon: selectedIcon.value,  // Salva o ícone selecionado
                user_id: loggedUser.id
            };

            // Obtém dados existentes do LocalStorage
            const existingData = localStorage.getItem('groups');
            let allData = existingData ? JSON.parse(existingData) : [];

            // Verifica se está em modo de edição
            if (isEditing.value) {
                const index = allData.findIndex(item => item.id === currentId.value);
                if (index !== -1) {
                    allData[index] = formData;  // Atualiza o item
                }
            } else {
                allData.push(formData);  // Adiciona um novo item
            }

            // Salva os dados atualizados no LocalStorage
            localStorage.setItem('groups', JSON.stringify(allData));

            // Exibe a mensagem de sucesso
            snackbar.value = true;
            usedIcons.value.add(selectedIcon.value);  
            form.value?.reset();
            description.value = '';
            selectedIcon.value = 'mdi-lightbulb-question';  

            if (isEditing.value) {
                navigateTo('/groups/list', { replace: true });
            }
        }
    } catch (error) {
        console.error('Error saving group:', error);
    }
};


onMounted(() => {
    const idParam = route.query.id as string;  // Pega o ID da URL
    const usedIconsSet = getUsedIcons();
    usedIcons.value = usedIconsSet;
    if (idParam) {
        const existingData = localStorage.getItem('groups');
        const allData = existingData ? JSON.parse(existingData) : [];
        const itemToEdit = allData.find(item => item.id === idParam && item.user_id === loggedUser.id);
        if (itemToEdit) {
            description.value = itemToEdit.description;
            selectedIcon.value = itemToEdit.icon || 'mdi-lightbulb-question';  // Define o ícone selecionado
            currentId.value = idParam;
            isEditing.value = true;  // Muda para modo de edição
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
                            :rules="[descriptionRules]" required :prepend-inner-icon="selectedIcon" />

                        <v-label class="font-weight-bold">Group Icon:</v-label> <!-- Melhorado com estilo -->
                        <v-row justify="space-evenly mt-2">
                            <v-col v-for="(icon, index) in iconOptions" :key="index" cols="auto">
                                <v-btn 
                                    @click="selectedIcon = icon.icon"
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

        <v-snackbar v-model="snackbar" @click="snackbar = false" timeout="3000" color="success" location="top right"
            elevation="12" variant="elevated" height="80px" min-height="60px" transition="slide-x-reverse-transition">
            <v-icon left size="30">mdi-check</v-icon>
            <h3 style="margin: 0; font-size: 16px; font-weight: bold; color: white; display: inline-block; margin-left: 10px;">
                Data sent successfully!
            </h3>
        </v-snackbar>

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