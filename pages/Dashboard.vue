<script setup lang="ts">
/*Call Components*/
 import TransactionsOverview from '@/components/dashboard/TransactionsOverview.vue';
import TotalGains from '@/components/dashboard/TotalGains.vue';
import MonthlyFinance from '@/components/dashboard/MonthlyFinance.vue';
import LatestTransactions from '@/components/dashboard/LatestTransactions.vue';
import PowerfulTransactions from '@/components/dashboard/PowerfulTransactions.vue';

useHead({
  title: "Dashboard - Finantial Controller",  // Título da página
});
</script>
<template>
    <v-row>
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
            <p class="text-muted">© Finantial Controller</p>
        </v-col>
    </v-row>
</template>