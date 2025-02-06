<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';

const groups = ref<any[]>([]);
const filters = ref({
    description: '',
});

const headers = ref([
    { title: '', key: 'icon' },
    { title: 'Description', key: 'description' },
    { title: 'Actions', key: 'actions' },
]);

const dialog = ref(false);
const itemToDelete = ref<any>(null);
const snackbar = ref(false);
const snackbarError = ref(false);
const loggedUser = JSON.parse(localStorage.getItem('loggedUser') || '{}');
const finances = ref<any[]>(JSON.parse(localStorage.getItem('finances') || '[]')); // Lista de finances recuperada do localStorage

useHead({
    title: "Groups - Finantial Controller",
});

definePageMeta({
    middleware: 'auth',
});

watchEffect(() => {
    const storedData = localStorage.getItem('groups') || '[]';

    groups.value = JSON.parse(storedData).filter((item: any) => item.user_id === loggedUser.id);
    if (filters.value.description) {
        groups.value = groups.value.filter(item =>
            item.description.toLowerCase().includes(filters.value.description.toLowerCase())
        );
    }
});

const editItem = (item: any) => {
    navigateTo(`/groups/register?id=${item.id}`), { replace: true }
};

// Função para abrir o modal de confirmação
const confirmDelete = (item: any) => {
    itemToDelete.value = item;
    dialog.value = true;
};

const deleteItem = () => {
    if (itemToDelete.value) {
        const isAssociatedWithFinance = finances.value.some(finance => finance.group_id === itemToDelete.value.id);

        if (isAssociatedWithFinance) {
            dialog.value = false;
            snackbarError.value = true;
            return;
        }

        const index = groups.value.indexOf(itemToDelete.value);
        if (index !== -1) {
            groups.value.splice(index, 1);
            localStorage.setItem('groups', JSON.stringify(groups.value));
        }
        dialog.value = false;
        snackbar.value = true;
    }
};

const cancelDelete = () => {
    dialog.value = false;
};
</script>

<template>
     <v-snackbar v-model="snackbar" @click="snackbar = false" timeout="3000" color="success" location="top right"
            elevation="12" variant="elevated" height="80px" min-height="60px" transition="slide-x-reverse-transition">
            <v-icon left size="30">mdi-check</v-icon>
            <h3
                style="margin: 0; font-size: 16px; font-weight: bold; color: white; display: inline-block; margin-left: 10px;">
                Data sent successfully!
            </h3>
        </v-snackbar>

    <v-snackbar v-model="snackbarError" @click="snackbarError = false" timeout="3000" color="error" location="top right"
        elevation="12" variant="elevated" max-width="300px" height="80px" min-height="60px" transition="slide-x-reverse-transition">
        <div style="display: flex; align-items: center;">
            <v-icon  left size="30">mdi-alert-circle</v-icon>
            <h3 class="ml-2">
                This group is associated with a finance and cannot be deleted.
            </h3>
        </div>
    </v-snackbar>
    <v-row>
        <v-col cols="12" md="12">
            <UiParentCard title="Groups list">
                <v-text-field v-model="filters.description" class="px-4" label="Search" outlined dense></v-text-field>

                <v-data-table :headers="headers" :items="groups" item-value="id" items-per-page="10" class="px-4">
                    <template v-slot:[`item.icon`]="{ item }">
                        <v-icon :icon="item.icon" size="25px"></v-icon>
                    </template>
                    <template v-slot:[`item.actions`]="{ item }">
                        <v-btn icon variant="text" @click="editItem(item)">
                            <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn icon variant="text" @click="confirmDelete(item)">
                            <v-icon>mdi-delete</v-icon>
                        </v-btn>
                    </template>

                </v-data-table>

            </UiParentCard>
        </v-col>
    </v-row>

    <v-row v-if="groups.length === 0">
        <v-col cols="12" md="12">
            <div class="d-flex justify-center align-center text-center">
                No groups to show. Click on the
                <v-btn icon variant="tonal" class="ms-1 mr-1" color="success">
                    <v-icon>mdi-plus</v-icon>
                </v-btn>
                button at the bottom right to add.
            </div>
        </v-col>
    </v-row>

    <v-dialog v-model="dialog" max-width="400px">
        <v-card>
            <v-card-title class="headline">Confirm Deletion</v-card-title>
            <v-card-text>
                Are you sure you want to delete this item?
            </v-card-text>
            <v-card-actions>
                <v-btn color="grey" text @click="cancelDelete">Cancel</v-btn>
                <v-btn color="error" text @click="deleteItem">Delete</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-footer app>
        <v-toolbar flat style="background-color: transparent;">
            <v-spacer></v-spacer>
            <v-btn icon variant="tonal" size="x-large" color="success"
                @click="navigateTo('/groups/register'), { replace: true }">
                <v-icon>mdi-plus</v-icon>
            </v-btn>
        </v-toolbar>
    </v-footer>

</template>