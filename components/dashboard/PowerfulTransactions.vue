<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { CircleIcon } from 'vue-tabler-icons';
const loggedUser = JSON.parse(localStorage.getItem('loggedUser') || '{}');

const powerfulTransaction = ref<any[]>([]);
const formatCurrency = (amount: number) => {
    return amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

onMounted(() => {
    const storedData = localStorage.getItem('finances') || '[]';

    if (storedData) {
        const allTransactions = JSON.parse(storedData).filter((item: any) => item.user_id === loggedUser.id);

        powerfulTransaction.value = allTransactions
            .sort((a: { amount: number }, b: { amount: number }) => b.amount - a.amount)
            .slice(0, 5);
    } else {
        powerfulTransaction.value = [];
    }
});
</script>

<template>
    <v-card elevation="10" class="withbg">
        <v-card-item class="pb-0">
            <v-card-title class="text-h5 pt-sm-2">Powerful Transactions</v-card-title>
            <div class="recent-transaction mt-10 px-3">
                <div v-for="item in powerfulTransaction" :key="item.description">
                    <v-row class="d-flex mb-4">
                        <v-col cols="4" lg="3" md="auto" sm="auto" class="px-0 pt-0 pb-1 d-flex align-start">
                            <h6 class="text-body-1 textSecondary text-no-wrap">{{ item.description }}</h6>
                        </v-col>
                        <v-col cols="1" sm="1" class="px-0 text-center pt-0 pb-1">
                            <CircleIcon size="13"
                                :class="item.type === 'I' ? 'text-success' : item.type === 'O' ? 'text-muted' : ''" />
                            <div v-if="item.date" class="line mx-auto bg-grey100"></div>
                        </v-col>
                        <v-col cols="7" sm="8" class="pt-0">
                            <h6 v-if="item.type" class="text-body-1 font-weight-bold">{{
                                formatCurrency(parseFloat(item.amount)) }} </h6>
                            <h6 class="text-body-1 text-muted">{{ item.note }}</h6>
                            <div class="mt-n1">
                                <div class="text-body-1 text-success text-decoration-none" v-if="item.date">{{
                                    item.date }}</div>
                            </div>
                        </v-col>
                    </v-row>
                </div>
            </div>
        </v-card-item>
    </v-card>
</template>

<style lang="scss">
.recent-transaction {
    .line {
        width: 2px;
        height: 35px;
    }
}
</style>
