<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';

const finances = ref<any[]>([]);
const filterDialog = ref(false);
const filters = ref({
    description: '', type: [], startDate: null,
    endDate: null
});
const Snackbar = inject('Snackbar') as (msg: string, type?: string) => void;

const headers = ref([
{ title: 'Description', key: 'description' },
{ title: 'Group', key: 'group_description' },
{ title: 'Date', key: 'date' },
    { title: 'Type', key: 'type' },
    { title: 'Amount', key: 'amount' },
    { title: 'Actions', key: 'actions' },
]);

const dialog = ref(false);
const itemToDelete = ref<any>(null);
const menuStart = ref(false);
const menuEnd = ref(false);
const formattedStartDate = ref('');
const formattedEndDate = ref('');
const loggedUser = JSON.parse(localStorage.getItem('loggedUser') || '{}');

const onEndDateChange = (date) => {
    if (!date) return '';
    const parsedDate = new Date(date);
    const day = `0${parsedDate.getDate()}`.slice(-2);
    const month = `0${parsedDate.getMonth() + 1}`.slice(-2);
    const year = parsedDate.getFullYear();
    formattedEndDate.value = `${day}/${month}/${year}`;
    menuEnd.value = false
    return formattedEndDate.value;
};

const onStartDateChange = (date) => {
    if (!date) return '';
    const parsedDate = new Date(date);
    const day = `0${parsedDate.getDate()}`.slice(-2);
    const month = `0${parsedDate.getMonth() + 1}`.slice(-2);
    const year = parsedDate.getFullYear();
    formattedStartDate.value = `${day}/${month}/${year}`;
    menuStart.value = false
    return formattedStartDate.value;
};

useHead({
    title: "Finances - Finantial Controller", 
});

definePageMeta({
    middleware: 'auth',
});

watchEffect(() => {
    
    const storedGroups = localStorage.getItem('groups') || '[]'; 
    const storedData = localStorage.getItem('finances') || '[]';
    const groups = JSON.parse(storedGroups); 
    finances.value = JSON.parse(storedData).filter((item: any) => item.user_id === loggedUser.id);

    finances.value.forEach((item: any) => {
        const group = groups.find((group: any) => group.id === item.group_id);
        if (group) {
            item.group_description = group.description; 
        }else{
            item.group_description = ''; 
        }
        const dateParts = item.date.split('/');
        if (dateParts.length === 3) {
            item.date = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
        }
    });

    finances.value.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    finances.value.forEach((item: any) => {
        const dateParts = item.date.split('-');
        if (dateParts.length === 3) {
            item.date = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
        }
    });

    if (filters.value.description) {
        finances.value = finances.value.filter(item =>
            item.description.toLowerCase().includes(filters.value.description.toLowerCase())
        );
    }

    if (filters.value.type.length > 0) {
        // @ts-ignore
        finances.value = finances.value.filter(item => filters.value.type.includes(item.type));
    }
    if (filters.value.startDate || filters.value.endDate) {
        finances.value = finances.value.filter(item => {
            const itemDate = new Date(item.date.split('/').reverse().join('-')).getTime();
            const startDate = filters.value.startDate ? new Date(filters.value.startDate).getTime() : null;
            const endDate = filters.value.endDate ? new Date(filters.value.endDate).getTime() : null;

            if (startDate && endDate) {
                return itemDate >= startDate && itemDate <= endDate;
            } else if (startDate) {
                return itemDate >= startDate;
            } else if (endDate) {
                return itemDate <= endDate;
            }
            return true;
        });
    }
});

const formatCurrency = (amount: number) => {
    return amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const editItem = (item: any) => {
    navigateTo(`/finances/register?id=${item.id}`), { replace: true }
};

const confirmDelete = (item: any) => {
    itemToDelete.value = item;
    dialog.value = true;
};

const deleteItem = () => {
    if (itemToDelete.value) {
        const index = finances.value.indexOf(itemToDelete.value);
        if (index !== -1) {
            finances.value.splice(index, 1);
            localStorage.setItem('finances', JSON.stringify(finances.value)); 
        }
        dialog.value = false; 
        Snackbar('Data deleted successfully!', 'success');
    }
};

const cancelDelete = () => {
    dialog.value = false; 
};


const openFilter = () => {
    filterDialog.value = true;
};

</script>

<template>
    <v-row>
        <v-col cols="12" md="12">
            <UiParentCard title="Finances list">
                <v-text-field v-model="filters.description" class="px-4" label="Search" outlined dense></v-text-field>

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

    <v-row v-if="finances.length === 0">
        <v-col cols="12" md="12">
            <div class="d-flex justify-center align-center text-center">
                No finances to show. Click on the
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

    <v-navigation-drawer v-model="filterDialog" app temporary location="right" width="300">
        <v-card>
            <v-card-title class="headline">Filter Options</v-card-title>
            <v-card-text>

                <v-label class="mt-5 mb-3">Date Range</v-label>
                <div class="d-flex">
                    <v-menu v-model="menuStart" :close-on-content-click="false">
                        <template v-slot:activator="{ props }">
                            <v-text-field v-model="formattedStartDate" label="Start Date" class="mr-2" readonly
                                v-bind="props"></v-text-field>
                        </template>
                        <v-date-picker v-model="filters.startDate"
                            @update:modelValue="onStartDateChange"></v-date-picker>
                    </v-menu>
                    <v-menu v-model="menuEnd" :close-on-content-click="false">
                        <template v-slot:activator="{ props }">
                            <v-text-field v-model="formattedEndDate" label="End Date" readonly
                                v-bind="props"></v-text-field>
                        </template>
                        <v-date-picker v-model="filters.endDate" @update:modelValue="onEndDateChange"></v-date-picker>
                    </v-menu>
                </div>
                <v-label>Type</v-label>
                <div class="d-flex align-center justify-center">
                    <v-checkbox v-model="filters.type" label="In" value="I" class="mr-4" />
                    <v-checkbox v-model="filters.type" label="Out" value="O" />
                </div>
            </v-card-text>

        </v-card>
    </v-navigation-drawer>

    <v-footer app>
        <v-toolbar flat style="background-color: transparent;">
            <v-spacer></v-spacer>
            <v-btn icon variant="tonal" size="x-large" class="mr-4" @click="openFilter">
                <v-icon>mdi-filter</v-icon>
            </v-btn>
            <v-btn icon variant="tonal" size="x-large" color="success"
                @click="navigateTo('/finances/register'), { replace: true }">
                <v-icon>mdi-plus</v-icon>
            </v-btn>
        </v-toolbar>
    </v-footer>

</template>