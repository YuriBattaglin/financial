<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import UiParentCard from '@/components/shared/UiParentCard.vue';

const form = ref<HTMLFormElement | null>(null);
const description = ref('');
const amount = ref<number | null>(null);
const type = ref('I');
const note = ref('');
const group = ref(null);
const selectedDate = ref(null);
const formattedDate = ref('');
const menu = ref(false);
const isEditing = ref(false);
const repeatType = ref(null);
const quantity = ref<number>(0);
const currentId = ref('');
const route = useRoute();
const loggedUser = JSON.parse(localStorage.getItem('loggedUser') || '{}');
const groups = ref([]);
const Snackbar = inject('Snackbar') as (msg: string, type?: string) => void;

const descriptionRules = (value) => {
    if (!value) return 'Description is required!';
    return true;
};

const amountRules = (value) => {
    if (!value) return 'Amount is required!';
    if (isNaN(value)) return 'Amount must be a number!';
    return true;
};

const quantityRules = (value) => {
    if (repeatType.value) {
        if (!value) return 'Quantity is required!';
        if (isNaN(value)) return 'Quantity must be a number!';
        if (value > 100) return 'Quantity must be 100 or lower!'
    }

    return true;
};
const clearDate = () => {
    formattedDate.value = '';
    selectedDate.value = null;
    quantity.value = 0;
    repeatType.value = null;
    menu.value = false;
};

const toggleRepeatType = (value) => {
    repeatType.value = repeatType.value === value ? null : value;
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

function adjustMonthByIndex(dateStr, index) {
    const [day, month, year] = dateStr.split('/');
    const date = new Date(year, month - 1, day);
    date.setMonth(date.getMonth() + index);
    return date.toLocaleDateString('pt-BR');
}
const submitForm = () => {
    try {
        const descriptionValid = descriptionRules(description.value) === true;
        const amountValid = amountRules(amount.value) === true;

        if (descriptionValid && amountValid) {
            let allData = [];

            const formData = {
                id: isEditing.value ? currentId.value : generateUniqueId(),
                description: description.value,
                group_id: group.value,
                amount: amount.value,
                type: type.value,
                note: note.value,
                date: formattedDate.value ? formattedDate.value : new Date().toLocaleDateString('pt-BR'),
                user_id: loggedUser.id
            };

            if ((repeatType.value === 'parcel' || repeatType.value === 'repeat') && !isNaN(quantity.value)) {
                let newFinances = [];

                if (repeatType.value === 'parcel') {
                    const amountPerFinance = amount.value ? amount.value / quantity.value : 0;
                    formData.amount = amountPerFinance;

                    for (let i = 0; i < quantity.value; i++) {
                        let newFinance = { ...formData };
                        newFinance.id = generateUniqueId();
                        newFinance.date = adjustMonthByIndex(formData.date, i);
                        newFinances.push(newFinance);
                    }
                } else if (repeatType.value === 'repeat') {
                    for (let i = 0; i < quantity.value; i++) {
                        let newFinance = { ...formData };
                        newFinance.id = generateUniqueId();
                        newFinance.date = adjustMonthByIndex(formData.date, i);
                        newFinances.push(newFinance);
                    }
                }

                allData = newFinances;
            } else {
                allData.push(formData);
            }

            const existingData = localStorage.getItem('finances');
            let storedData = existingData ? JSON.parse(existingData) : [];

            if (isEditing.value) {
                const index = storedData.findIndex(item => item.id === currentId.value);
                if (index !== -1) {
                    storedData = storedData.filter(item => item.id !== currentId.value);
                }
            }
            storedData = [...storedData, ...allData];

            localStorage.setItem('finances', JSON.stringify(storedData));

            Snackbar(isEditing.value ? 'Data updated successfully!' : 'Data sent successfully!', 'success');

            form.value?.reset();
            description.value = '';
            amount.value = null;
            type.value = 'I';
            note.value = '';
            formattedDate.value = '';
            isEditing.value = false;
            currentId.value = '';

            navigateTo('/finances/list', { replace: true });
        }
    } catch (error) {
        console.error(error);
    }
};

onMounted(() => {
    try {
        const storedGroups = JSON.parse(localStorage.getItem('groups') || '[]');
        groups.value = storedGroups.map(group => ({
            title: group.description,
            value: group.id,
        }));
    } catch (error) {
        console.error('Erro ao carregar grupos:', error);
    }

    const idParam = route.query.id as string;
    if (idParam) {
        const existingData = localStorage.getItem('finances');
        const allData = existingData ? JSON.parse(existingData) : [];
        const itemToEdit = allData.find(item => item.id === idParam && item.user_id === loggedUser.id);
        if (itemToEdit) {
            description.value = itemToEdit.description;
            group.value = itemToEdit.group_id;
            amount.value = itemToEdit.amount;
            type.value = itemToEdit.type;
            note.value = itemToEdit.note;
            formattedDate.value = itemToEdit.date;
            currentId.value = idParam;
            isEditing.value = true;
        }
    }
    useHead({
        title: isEditing.value ? "Editing finance - Finantial Controller" : "Registering finance - Finantial Controller",
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
                <UiParentCard :title="`${isEditing ? 'Edit finance' : 'Register finance'}`">
                    <div class="pa-7 pt-1 flex-grow-1">
                        <v-text-field v-model="description" maxlength="25" label="Description"
                            :rules="[descriptionRules]" required></v-text-field>

                        <v-row>
                            <v-col cols="6">
                                <v-text-field v-model="amount" :rules="[amountRules]" label="Amount" type="number"
                                    required></v-text-field>
                            </v-col>
                            <v-col cols="6">
                                <v-autocomplete v-model="group" label="Group" :items="groups" item-title="title"
                                    item-value="value" required></v-autocomplete>
                            </v-col>
                        </v-row>
                        <v-radio-group v-model="type" inline>
                            <v-radio label="In" value="I" color="success" class="mr-5"></v-radio>
                            <v-radio label="Out" value="O" color="success"></v-radio>
                        </v-radio-group>
                        <v-row no-gutters>
                            <v-col :cols="12" :md="5" class="pa-0">
                                <v-menu v-model="menu" :close-on-content-click="false">
                                    <template v-slot:activator="{ props }">
                                        <v-text-field v-model="formattedDate" label="Select Date"
                                            prepend-inner-icon="mdi-calendar" append-inner-icon="mdi-cancel"
                                            @click:append-inner="clearDate" readonly v-bind="props" />
                                    </template>
                                    <v-date-picker v-model="selectedDate"
                                        @update:model-value="onDateChange"></v-date-picker>
                                </v-menu>
                            </v-col>
                            <v-col :cols="12" :md="3" class="d-flex align-center pa-0">
                                <v-radio-group v-model="repeatType" inline :disabled="!formattedDate">
                                    <v-tooltip location="top" content-class="bg-success">
                                        <template v-slot:activator="{ props }">
                                            <v-radio label="Parcel" class="mr-4" value="parcel" color="success"
                                                @click="toggleRepeatType('parcel')" v-bind="props"></v-radio>
                                        </template>
                                        <span>Create new finances dividing the amount</span>
                                    </v-tooltip>

                                    <v-tooltip location="top" content-class="bg-success">
                                        <template v-slot:activator="{ props }">
                                            <v-radio label="Repeat" @click="toggleRepeatType('repeat')" class="mr-4"
                                                value="repeat" color="success" v-bind="props"></v-radio>
                                        </template>
                                        <span>Create new finances only updating the month</span>
                                    </v-tooltip>
                                </v-radio-group>
                            </v-col>
                            <v-col :cols="12" :md="4" class="pa-0">
                                <v-text-field v-model="quantity" label="Quantity" type="number" :rules="[quantityRules]"
                                    required :disabled="!repeatType || !formattedDate" />
                            </v-col>
                        </v-row>

                        <v-textarea label="Note" v-model="note" rows="4" outlined prepend-inner-icon="mdi-message"
                            maxlength="100"></v-textarea>
                    </div>

                </UiParentCard>
            </v-col>
        </v-row>

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
