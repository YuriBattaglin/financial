<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';

// Estado para armazenar os dados das finances
const finances = ref<any[]>([]);

// Configuração da tabela
const headers = ref([
    { title: 'Description', key: 'description' },
    { title: 'Date', key: 'date' },
    { title: 'Type', key: 'type' },
    { title: 'Amount', key: 'amount' },
    { title: 'Actions', key: 'actions' }, // Coluna de Ações
]);

const dialog = ref(false); 
const itemToDelete = ref<any>(null); 
const snackbar = ref(false); 

useHead({
  title: "Finances - Finantial Controller",  // Título da página
});

watchEffect(() => {
    const storedData = localStorage.getItem('finances') || '[]';
    finances.value = JSON.parse(storedData);

    finances.value.forEach((item: any) => {
        const dateParts = item.date.split('/'); 
        if (dateParts.length === 3) {
            item.date = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`; 
        }
    });

    finances.value.sort((a, b) => {
        const dateA = new Date(a.date).getTime(); 
        const dateB = new Date(b.date).getTime(); // Converte a data para timestamp
        return dateB - dateA; // Ordenação decrescente
    });
      // Após ordenação, formata as datas novamente para 'DD/MM/YYYY'
      finances.value.forEach((item: any) => {
        const dateParts = item.date.split('-');
        if (dateParts.length === 3) {
            item.date = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`; // Converte de volta para 'DD/MM/YYYY'
        }
    });
});

// Função para formatar valores em reais
const formatCurrency = (amount: number) => {
    return amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const editItem = (item: any) => {
    navigateTo(`/finances/register?id=${item.id}`), { replace: true }
};

// Função para abrir o modal de confirmação
const confirmDelete = (item: any) => {
    itemToDelete.value = item;
    dialog.value = true;
};

// Função para excluir a linha após confirmação
const deleteItem = () => {
    if (itemToDelete.value) {
        const index = finances.value.indexOf(itemToDelete.value);
        if (index !== -1) {
            finances.value.splice(index, 1);
            localStorage.setItem('finances', JSON.stringify(finances.value)); // Atualiza o localStorage
        }
        dialog.value = false; // Fecha o modal após a exclusão
        snackbar.value = true;
    }
};

// Função para cancelar a exclusão
const cancelDelete = () => {
    dialog.value = false; // Fecha o modal sem excluir
};

</script>

<template>
    <v-snackbar v-model="snackbar" @click="snackbar = false" timeout="3000" color="success" location="top right"
        elevation="12" variant="elevated" height="80px" min-height="60px" transition="slide-x-reverse-transition">
        <v-icon left size="30">mdi-check</v-icon>
        <h3 style="margin: 0; font-size: 16px; font-weight: bold; color: white; display: inline-block; margin-left: 10px;">
            Data deleted successfully!
        </h3>
    </v-snackbar>

    <v-row>
        <v-col cols="12" md="12">
            <UiParentCard title="Finances list">
                <v-data-table :headers="headers" :items="finances" item-value="description" items-per-page="10"
                    class="px-4">
                    <template v-slot:[`item.amount`]="{ item }">
                        <span :class="item.amount >= 0 ? 'text-success' : 'text-error'">
                            {{ formatCurrency(parseFloat(item.amount)) }}
                        </span>
                    </template>

                    <template v-slot:[`item.type`]="{ item }">
                        <v-chip :class="'text-body-1 bg-' + (item.type === 'I' ? 'success' : 'muted')" color="white"
                            size="small">
                            {{ item.type === 'I' ? 'IN' : 'OUT' }}
                        </v-chip>
                    </template>

                    <template v-slot:[`item.actions`]="{ item }">
                        <v-btn icon variant="text"  @click="editItem(item)">
                            <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn icon variant="text"  @click="confirmDelete(item)">
                            <v-icon>mdi-delete</v-icon>
                        </v-btn>
                    </template>

                </v-data-table>
            </UiParentCard>
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
                @click="navigateTo('/finances/register'), { replace: true }">
                <v-icon>mdi-plus</v-icon>
            </v-btn>
        </v-toolbar>
    </v-footer>
</template>
