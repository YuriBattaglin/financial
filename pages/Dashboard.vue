<script setup lang="ts">
/*Call Components*/
import TransactionsOverview from '@/components/dashboard/TransactionsOverview.vue';
import TotalGains from '@/components/dashboard/TotalGains.vue';
import MonthlyFinance from '@/components/dashboard/MonthlyFinance.vue';
import LatestTransactions from '@/components/dashboard/LatestTransactions.vue';
import PowerfulTransactions from '@/components/dashboard/PowerfulTransactions.vue';

const getCurrentMonthYear = () => {
    const now = new Date();
    const month = now.toLocaleString("en-Us", { month: "long" });
    const year = now.getFullYear();
    return `${month} ${year}`;
};

const getMonthYearFromDate = (date: string) => {
    const [day, month, year] = date.split("/");
    const monthName = new Date(parseInt(year), parseInt(month) - 1, parseInt(day)).toLocaleString("en-Us", { month: "long" });
    return `${monthName} ${year}`;
};

const handleClick = (group) => {
    if(selectedGroup.value === group){
        selectedGroup.value = null;
    }else{
        selectedGroup.value = group;
    }
};

const loadAvailableMonths = () => {
    const storedData = localStorage.getItem("finances") || "[]";
    const allTransactions: { date: string }[] = JSON.parse(storedData).filter((item: any) => item.user_id === loggedUser.id);;

    const uniqueMonths = Array.from(
        new Set(allTransactions.map(transaction => getMonthYearFromDate(transaction.date)))
    );

    uniqueMonths.sort((a, b) => {
        const [monthA, yearA] = a.split(" ");
        const [monthB, yearB] = b.split(" ");

        const monthIndexA = monthMap[monthA.toLowerCase()];
        const monthIndexB = monthMap[monthB.toLowerCase()];

        if (yearA === yearB) {
            return monthIndexA - monthIndexB; 
        } else {
            return parseInt(yearA) - parseInt(yearB); 
        }
    });

    items.value = uniqueMonths;

    if (!items.value.includes(getCurrentMonthYear())) {
        items.value.push(getCurrentMonthYear());
    }

    select.value = getCurrentMonthYear();
};

const loggedUser = JSON.parse(localStorage.getItem('loggedUser') || '{}');
const select = ref(getCurrentMonthYear());
const selectedGroup = ref(<any>null);
const items = ref<string[]>([]);
const groupsData = localStorage.getItem('groups') || '[]';
const groups = ref<any[]>(JSON.parse(groupsData)); 
const currentPage = ref(0);
const itemsPerPage = 5;
const totalPages = computed(() => Math.ceil(groups.value.length / itemsPerPage));

const paginatedGroups = computed(() => {
    const start = currentPage.value * itemsPerPage;
    const end = start + itemsPerPage;
    return groups.value.slice(start, end);
});

const goToPage = (page) => {
    if (page >= 0 && page < totalPages.value) {
        currentPage.value = page;
    }
};
const monthMap: { [key: string]: number } = {
    "january": 0, "february": 1, "march": 2, "april": 3, "may": 4, "june": 5,
    "july": 6, "august": 7, "september": 8, "october": 9, "november": 10, "december": 11
};
const greetings = [
    "How are you?",
    "How's everything going?",
    "How do you feel?",
    "What's up?",
    "How are you doing today?"
];
const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];


useHead({
    title: "Dashboard - Financial Controller",
});

definePageMeta({
    middleware: 'auth',
});

onMounted(loadAvailableMonths);
</script>

<template>
    <v-row class="d-flex  justify-space-between">
        <v-col cols="auto">
            <v-label class="text-h4">
                Welcome, {{ loggedUser.name || 'User' }}!
            </v-label>
            <v-label class="ml-2 text-h7">
                {{ randomGreeting }}
            </v-label>
        </v-col>
        <v-col cols="auto" v-if="groups.length > 0">
            <v-btn @click="goToPage(currentPage - 1)" :disabled="currentPage <= 0" icon>
                <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn v-for="(group, index) in paginatedGroups" :key="index" icon @click="handleClick(group)" class="mx-1"
            :class="{ 'v-btn--active': selectedGroup === group }"
            >
                <v-icon v-if="group.icon" :icon="group.icon"></v-icon>
                <v-icon v-else>mdi-lightbulb-question</v-icon>
            </v-btn>
            <v-btn @click="goToPage(currentPage + 1)" :disabled="currentPage >= totalPages - 1" icon>
                <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
        </v-col>
        <v-col cols="auto">
            <v-select v-model="select" :items="items" variant="outlined" density="compact" class="ml-3"
                hide-details></v-select>
        </v-col>
    </v-row>
    <v-row v-if="selectedGroup">
    <span class="text-subtitle-1 font-weight-bold ms-3">
          {{ 'Showing by group:' }}
          <span class="text-subtitle-1 text-muted ms-1">
            {{ selectedGroup.description }}
          </span>
        </span>
    </v-row>
    <v-row>
        <v-col cols="12">
            <v-row>
                <v-col cols="12" lg="4">
                    <div class="mb-6">
                        <MonthlyFinance :selectedMonth="select" :selectedGroup="selectedGroup" />
                    </div>
                    <div>
                        <TotalGains :selectedGroup="selectedGroup" />
                    </div>
                </v-col>
                <v-col cols="12" lg="8">
                    <TransactionsOverview :selectedMonth="select" :selectedGroup="selectedGroup" />
                </v-col>

                <v-col cols="12" lg="8">
                    <LatestTransactions :selectedGroup="selectedGroup" />
                </v-col>
                <v-col cols="12" lg="4">
                    <PowerfulTransactions :selectedGroup="selectedGroup" />
                </v-col>
            </v-row>
        </v-col>
        <v-col class="text-center mt-2">
            <p class="text-muted">© Financial Controller</p>
        </v-col>
    </v-row>
</template>