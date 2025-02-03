<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';  // Importa useRoute e useRouter
import UiParentCard from '@/components/shared/UiParentCard.vue';

// Definição das variáveis reativas
const form = ref<HTMLFormElement | null>(null);
const description = ref('');
const amount = ref<number | null>(null);
const type = ref('I');
const note = ref('');
const selectedDate = ref(null);
const formattedDate = ref('');
const menu = ref(false);
const snackbar = ref(false);
const isEditing = ref(false);  // Nova variável para determinar se é modo de edição
const currentId = ref('');  // ID do item que será editado
const route = useRoute();  // Para acessar os parâmetros da URL
const loggedUser = JSON.parse(localStorage.getItem('loggedUser') || '{}');

const descriptionRules = (value) => {
    if (!value) return 'Description is required!';
    return true;
};

const amountRules = (value) => {
    if (!value) return 'Amount is required!';
    if (isNaN(value)) return 'Amount must be a number!';
    return true;
};

const onDateChange = (date) => {
    if (!date) return '';
    const parsedDate = new Date(date);
    const day = `0${parsedDate.getDate()}`.slice(-2);
    const month = `0${parsedDate.getMonth() + 1}`.slice(-2);
    const year = parsedDate.getFullYear();
    formattedDate.value = `${day}/${month}/${year}`;
    menu.value = false;
    return formattedDate.value;
};

const generateUniqueId = () => {
    return `id-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

const submitForm = () => {
    try {


        const descriptionValid = descriptionRules(description.value) === true;
        const amountValid = amountRules(amount.value) === true;

        if (descriptionValid && amountValid) {
            const formData = {
                id: isEditing.value ? currentId.value : generateUniqueId(),
                description: description.value,
                amount: amount.value,
                type: type.value,
                note: note.value,
                date: formattedDate.value ? formattedDate.value : new Date().toLocaleDateString('pt-BR'),
                user_id: loggedUser.id
            };

            const existingData = localStorage.getItem('finances');
            let allData = existingData ? JSON.parse(existingData) : [];

            if (isEditing.value) {
                const index = allData.findIndex(item => item.id === currentId.value);
                if (index !== -1) {
                    allData[index] = formData;
                }
            } else {
                allData.push(formData);
            }

            localStorage.setItem('finances', JSON.stringify(allData));
            snackbar.value = true;

            form.value?.reset();
            description.value = '';
            amount.value = null;
            type.value = 'I';
            note.value = '';
            formattedDate.value = '';
            if (isEditing.value) {
                navigateTo('/finances/list', { replace: true });
            };
        }
    } catch (error) {
    }
};

onMounted(() => {
    const idParam = route.query.id as string;  // Pega o ID da URL
    if (idParam) {
        const existingData = localStorage.getItem('finances');
        const allData = existingData ? JSON.parse(existingData) : [];
        const itemToEdit = allData.find(item => item.id === idParam && item.user_id === loggedUser.id);
        if (itemToEdit) {
            description.value = itemToEdit.description;
            amount.value = itemToEdit.amount;
            type.value = itemToEdit.type;
            note.value = itemToEdit.note;
            formattedDate.value = itemToEdit.date;
            currentId.value = idParam;
            isEditing.value = true;  // Muda para modo de edição
        }
    }

    useHead({
  title: isEditing.value ? "Editing finance - Finantial Controller" : "Register finance - Finantial Controller",
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
                <UiParentCard title="Register finance">
                    <div class="pa-7 pt-1 flex-grow-1">
                        <v-text-field v-model="description" maxlength="25" label="Description"
                            :rules="[descriptionRules]" required></v-text-field>
                        <v-text-field v-model="amount" :rules="[amountRules]" label="Amount" type="number"
                            required></v-text-field>
                        <v-menu v-model="menu" :close-on-content-click="false" >
                            <template v-slot:activator="{ props }">
                                <v-text-field v-model="formattedDate" label="Select Date"
                                    prepend-inner-icon="mdi-calendar" readonly v-bind="props" />
                            </template>
                            <v-date-picker v-model="selectedDate" @update:model-value="onDateChange"></v-date-picker>
                        </v-menu>
                        <v-radio-group v-model="type" inline>
                            <v-radio label="In" value="I" color="success" class="mr-5"></v-radio>
                            <v-radio label="Out" value="O" color="success"></v-radio>
                        </v-radio-group>
                        <v-textarea label="Note" v-model="note" rows="4" outlined prepend-inner-icon="mdi-message"
                            maxlength="100"></v-textarea>
                    </div>
                </UiParentCard>
            </v-col>
        </v-row>

        <v-snackbar v-model="snackbar" @click="snackbar = false" timeout="3000" color="success" location="top right"
            elevation="12" variant="elevated" height="80px" min-height="60px" transition="slide-x-reverse-transition">
            <v-icon left size="30">mdi-check</v-icon>
            <h3
                style="margin: 0; font-size: 16px; font-weight: bold; color: white; display: inline-block; margin-left: 10px;">
                Data sent successfully!
            </h3>
        </v-snackbar>

        <v-footer app>
            <v-toolbar flat style="background-color: transparent;">
                <v-btn icon variant="text" size="x-large" @click="navigateTo('/finances/list'), { replace: true }">
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
