<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useTheme } from "vuetify";
const props = defineProps<{ selectedMonth: string, selectedGroup: any }>();

const getMonthYearFromDate = (date: string) => {
  const [day, month, year] = date.split("/");
  const monthName = new Date(parseInt(year), parseInt(month) - 1, parseInt(day)).toLocaleString("en-Us", { month: "long" });
  return `${monthName} ${year}`;
};

const monthMap: { [key: string]: number } = {
  "january": 0, "february": 1, "march": 2, "april": 3, "may": 4, "june": 5,
  "july": 6, "august": 7, "september": 8, "october": 9, "november": 10, "december": 11
};

const loggedUser = ref(JSON.parse(localStorage.getItem("loggedUser") || "{}"));

const loadAvailableMonths = () => {
  const storedData = localStorage.getItem("finances") || "[]";
  const allTransactions: { date: string }[] = JSON.parse(storedData).filter((item: any) => item.user_id === loggedUser.value.id);

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

  return uniqueMonths;
};

const categories = computed(() => {
  if (!props.selectedMonth) return [];

  const [monthName, year] = props.selectedMonth.split(" ");
  const monthIndex = monthMap[monthName.toLowerCase()];
  if (monthIndex === undefined) return [];

  const daysInMonth = new Date(parseInt(year), monthIndex + 1, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`);
});

const filterTransactionsByMonth = (monthYear: string) => {
  const storedData = localStorage.getItem("finances") || "[]";
  const allTransactions = JSON.parse(storedData).filter((item: any) => item.user_id === loggedUser.value.id);

  return allTransactions.filter((transaction: any) => {
    const transactionMonthYear = getMonthYearFromDate(transaction.date);
    const matchesMonth = transactionMonthYear === monthYear;
    const matchesGroup = !props.selectedGroup || transaction.group_id === props.selectedGroup.id;

    return matchesMonth && matchesGroup;
  });
};

const formatDate = (dateString: string) => {
  const dateParts = dateString.split('/');
  if (dateParts.length === 3) {
    const year = dateParts[2].length === 2 ? '20' + dateParts[2] : dateParts[2];
    return `${year}-${dateParts[1]}-${dateParts[0]}`;
  }
  return dateString;
};

const getChartDataForMonth = (monthYear: string) => {
  const filteredTransactions = filterTransactionsByMonth(monthYear);
  const dailyEarnings: number[] = [];
  const dailyExpenses: number[] = [];

  const [monthName, year] = monthYear.split(" ");
  const monthIndex = monthMap[monthName.toLowerCase()];
  const daysInMonth = new Date(parseInt(year), monthIndex + 1, 0).getDate();

  for (let i = 1; i <= daysInMonth; i++) {
    const earningsForDay = filteredTransactions.filter((t: any) => {
      const transactionDate = new Date(formatDate(t.date) + "T00:00:00");
      return transactionDate.getDate() === i && t.type === "I";
    });

    const expensesForDay = filteredTransactions.filter((t: any) => {
      const transactionDate = new Date(formatDate(t.date) + "T00:00:00");
      return transactionDate.getDate() === i && t.type === "O";
    });

    dailyEarnings.push(earningsForDay.reduce((sum: number, t: any) => sum + parseFloat(t.amount), 0));
    dailyExpenses.push(expensesForDay.reduce((sum: number, t: any) => sum + parseFloat(t.amount), 0));
  }

  return { dailyEarnings, dailyExpenses };
};

const theme = useTheme();
const muted = theme.current.value.colors.muted;
const success = theme.current.value.colors.success;
const chartData = ref(getChartDataForMonth(props.selectedMonth));
const isDarkTheme = ref(localStorage.getItem("theme") === "DarkTheme");

const chartOptions = computed(() => {
  const maxEarnings = Math.max(...chartData.value.dailyEarnings, 0);
  const maxExpenses = Math.max(...chartData.value.dailyExpenses, 0);
  const maxValue = Math.max(maxEarnings, maxExpenses) || 10;

  return {
    series: [
      { name: "Earnings per day:", data: chartData.value.dailyEarnings },
      { name: "Expenses per day:", data: chartData.value.dailyExpenses },
    ],
    chartOptions: {
      grid: { borderColor: "rgba(0,0,0,0.1)", strokeDashArray: 3 },
      plotOptions: { bar: { horizontal: true, columnWidth: "35%", borderRadius: [8] } },
      colors: [success, muted],
      chart: { type: "bar", height: 370, toolbar: { show: false } },
      dataLabels: { enabled: false },
      xaxis: { type: "category", categories: categories.value },
      yaxis: { min: 0, max: maxValue + 2, tickAmount: 4 },
      tooltip: { theme: isDarkTheme.value ? "dark" : "light" },
    },
  };
});

watch(
  [() => props.selectedMonth, () => props.selectedGroup],
  ([newMonthYear]) => {
    chartData.value = getChartDataForMonth(newMonthYear);
  },
  { immediate: true }
);

onMounted(loadAvailableMonths);
</script>

<template>
  <v-card elevation="10" class="withbg">
    <v-card-item>
      <div class="d-sm-flex align-center justify-space-between pt-sm-2">
        <v-card-title class="text-h5">Overview<span
            class="text-subtitle-1 text-muted ml-2">by month</span></v-card-title>
      </div>
      <div class="mt-6">
        <apexchart type="bar" height="370px" :options="chartOptions.chartOptions" :series="chartOptions.series">
        </apexchart>
      </div>
    </v-card-item>
  </v-card>
</template>
