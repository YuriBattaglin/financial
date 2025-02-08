<script setup lang="ts">
import { ref, onMounted } from 'vue';

const latestTransactions = ref<any[]>([]);
const loggedUser = JSON.parse(localStorage.getItem('loggedUser') || '{}');
const props = defineProps<{ selectedGroup: any }>();

const formatCurrency = (amount: number) => {
    return amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

watchEffect(() => {
    const storedData = localStorage.getItem('finances') || '[]';

    if (storedData) {
        let allTransactions = JSON.parse(storedData).filter((item: any) => item.user_id === loggedUser.id)
        if(props.selectedGroup?.id){
            allTransactions = allTransactions.filter((item: any) => item.group_id === props.selectedGroup.id);
        }

        latestTransactions.value = allTransactions
            .sort((a: { date: string }, b: { date: string }) => {
                const parseDate = (dateStr: string) => {
                    const [day, month, year] = dateStr.split('/');
                    return new Date(`${year}-${month}-${day}`);
                };

                const dateA = parseDate(a.date);
                const dateB = parseDate(b.date);
                return dateB.getTime() - dateA.getTime();
            })
            .slice(0, 4);
    } else {
        latestTransactions.value = [];
    }
});
</script>

<template>
    <v-card elevation="10" class="">
        <v-card-item class="pa-6">
            <v-card-title class="text-h5 pt-sm-2 pb-7">Latest Transactions</v-card-title>
            <v-table class="month-table">
                <thead>
                    <tr>
                        <th class="text-subtitle-1 font-weight-bold">Description</th>
                        <th class="text-subtitle-1 font-weight-bold">Date</th>
                        <th class="text-subtitle-1 font-weight-bold">Type</th>
                        <th class="text-subtitle-1 font-weight-bold text-right">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in latestTransactions" :key="item.description" class="month-item">
                        <td>
                            <div class="">
                                <h6 class="text-subtitle-1 font-weight-bold">{{ item.description }}</h6>
                                <div class="text-13 mt-1 text-muted">{{ item.note }}</div>
                            </div>
                        </td>
                        <td>
                            <h6 class="text-body-1 text-success">{{ item.date }}</h6>
                        </td>
                        <td>
                            <v-chip :class="'text-body-1 bg-' + (item.type === 'I' ? 'success' : 'muted')" color="white"
                                size="small">
                                {{ item.type === 'I' ? 'IN' : 'OUT' }}
                            </v-chip>
                        </td>
                        <td>
                            <h6 class="text-h6 text-right">
                                {{ formatCurrency(parseFloat(item.amount)) }}
                            </h6>
                        </td>
                    </tr>
                </tbody>
            </v-table>
        </v-card-item>
    </v-card>
</template>
