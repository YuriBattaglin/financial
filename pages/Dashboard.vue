<script setup lang="ts">
/*Call Components*/
import TransactionsOverview from '@/components/dashboard/TransactionsOverview.vue';
import TotalGains from '@/components/dashboard/TotalGains.vue';
import MonthlyFinance from '@/components/dashboard/MonthlyFinance.vue';
import LatestTransactions from '@/components/dashboard/LatestTransactions.vue';
import PowerfulTransactions from '@/components/dashboard/PowerfulTransactions.vue';

const loggedUser = JSON.parse(localStorage.getItem('loggedUser') || '{}');

// Lista de frases para perguntar como o usuário está
const greetings = [
  "How are you?",
  "How's everything going?",
  "How do you feel?",
  "What's up?",
  "How are you doing today?"
];

// Escolher uma saudação aleatória
const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];

useHead({
  title: "Dashboard - Financial Controller",  // Título da página
});
</script>

<template>
    <v-row>
        <v-col cols="12">
            <v-label class="text-h4">
                Welcome, {{ loggedUser.name || 'User' }}!
            </v-label>
            <v-label class="ml-2 text-h7 ">
                {{ randomGreeting }}
            </v-label>
        </v-col>
        <v-col cols="12">
            <v-row>
                <v-col cols="12" lg="4">
                    <div class="mb-6">
                        <TotalGains />
                    </div>
                    <div>
                        <MonthlyFinance />
                    </div>
                </v-col>
                <v-col cols="12" lg="8">
                    <TransactionsOverview />
                </v-col>
                
                <v-col cols="12" lg="8">
                    <LatestTransactions />
                </v-col>
                <v-col cols="12" lg="4">
                    <PowerfulTransactions />
                </v-col>
            </v-row>
        </v-col>
        <v-col class="text-center mt-2">
            <p class="text-muted">© Financial Controller</p>
        </v-col>
    </v-row>
</template>