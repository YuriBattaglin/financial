<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useTheme } from "vuetify";

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

const loadAvailableMonths = () => {
  const storedData = localStorage.getItem("finances") || "[]";
  const allTransactions: { date: string }[] = JSON.parse(storedData); 

  const uniqueMonths = Array.from(
    new Set(allTransactions.map(transaction => getMonthYearFromDate(transaction.date)))
  );

  uniqueMonths.sort((a, b) => {
    const [monthA, yearA] = a.split(" ");
    const [monthB, yearB] = b.split(" ");
    return new Date(`${monthA} 1, ${yearA}`).getTime() - new Date(`${monthB} 1, ${yearB}`).getTime();
  });

  items.value = uniqueMonths;

  if (!items.value.includes(getCurrentMonthYear())) {
    items.value.push(getCurrentMonthYear());
  }
  select.value = getCurrentMonthYear();
};

const monthMap: { [key: string]: number } = {
  "january": 0, "february": 1, "march": 2, "april": 3, "may": 4, "june": 5,
  "july": 6, "august": 7, "september": 8, "october": 9, "november": 10, "december": 11
};

const categories = computed(() => {
  const [monthName, year] = select.value.split(" ");
  const monthIndex = monthMap[monthName.toLowerCase()]; 

  if (monthIndex === undefined) return []; 

  const daysInMonth = new Date(parseInt(year), monthIndex + 1, 0).getDate(); 

  return Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`);
});

const filterTransactionsByMonth = (monthYear: string) => {
  const storedData = localStorage.getItem('finances') || '[]';
  const allTransactions = JSON.parse(storedData);

  return allTransactions.filter((transaction: any) => {
    const transactionMonthYear = getMonthYearFromDate(transaction.date);
    return transactionMonthYear === monthYear;
  });
};

const formatDate = (dateString: string) => {
  const dateParts = dateString.split('/');  
  if (dateParts.length === 3) {
    const year = '20' + dateParts[2];  
    const month = dateParts[1];
    const day = dateParts[0];
    return `${year}-${month}-${day}`;  
  }
  return dateString;  
};

const getChartDataForMonth = (monthYear: string) => {
  const filteredTransactions = filterTransactionsByMonth(monthYear);
  const dailyEarnings: number[] = [];
  const dailyExpenses: number[] = [];

  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  for (let i = 1; i <= daysInMonth; i++) {
    const earningsForDay = filteredTransactions.filter((t: any) =>  new Date(formatDate(t.date)).getDate() === i && t.type === 'I');
    const expensesForDay = filteredTransactions.filter((t: any) =>  new Date(formatDate(t.date)).getDate() === i && t.type === 'O');

    dailyEarnings.push(earningsForDay.reduce((sum: number, t: any) => sum + parseFloat(t.amount), 0));
    dailyExpenses.push(expensesForDay.reduce((sum: number, t: any) => sum + parseFloat(t.amount), 0));
  }

  return { dailyEarnings, dailyExpenses };
};

const theme = useTheme();
const muted = theme.current.value.colors.muted;
const success = theme.current.value.colors.success;
const select = ref(getCurrentMonthYear());
const items = ref<string[]>([]);
const chartData = ref(getChartDataForMonth(select.value));
const isDarkTheme = ref(false);
const savedTheme = localStorage.getItem("theme") || "DarkTheme";
isDarkTheme.value = savedTheme === "DarkTheme";

const chartOptions = computed(() => {
  const maxEarnings = Math.max(...chartData.value.dailyEarnings, 0);
  const maxExpenses = Math.max(...chartData.value.dailyExpenses, 0);
  const maxValue = Math.max(maxEarnings, maxExpenses);

  return {
    series: [
      {
        name: "Earnings this day:",
        data: chartData.value.dailyEarnings,
      },
      {
        name: "Expense this day:",
        data: chartData.value.dailyExpenses,
      },
    ],
    chartOptions: {
      grid: {
        borderColor: "rgba(0,0,0,0.1)",
        strokeDashArray: 3,
        xaxis: {
          lines: {
            show: false,
          },
        },
      },
      plotOptions: {
        bar: { horizontal: false, columnWidth: "35%", borderRadius: [8] },
      },
      colors: [success, muted],
      chart: {
        type: "bar",
        height: 370,
        offsetX: -15,
        toolbar: { show: false },
        foreColor: "#adb0bb",
        fontFamily: "inherit",
        sparkline: { enabled: false },
      },
      dataLabels: { enabled: false },
      markers: { size: 0 },
      legend: { show: false },
      xaxis: {
        type: "category",
        categories: categories.value,
        labels: {
          style: { cssClass: "grey--text lighten-2--text fill-color" },
        },
      },
      yaxis: {
        show: true,
        min: 0,
        max: maxValue + 2,
        tickAmount: 4,
        labels: {
          style: {
            cssClass: "grey--text lighten-2--text fill-color",
          },
        },
      },
      stroke: {
        show: true,
        width: 10,
        lineCap: "butt",
        colors: ["transparent"],
      },
      tooltip: { theme: isDarkTheme.value ? "dark" : "light" },
      responsive: [
        {
          breakpoint: 600,
          options: {
            plotOptions: {
              bar: {
                borderRadius: 3,
              },
            },
          },
        },
      ],
    },
  };
});

watch(select, (newMonthYear) => {
  chartData.value = getChartDataForMonth(newMonthYear);
});

onMounted(loadAvailableMonths);
</script>

<template>
  <v-card elevation="10" class="withbg">
    <v-card-item>
      <div class="d-sm-flex align-center justify-space-between pt-sm-2">
        <div><v-card-title class="text-h5">Overview</v-card-title></div>
        <div class="my-sm-0 my-2">
          <v-select v-model="select" :items="items" variant="outlined" density="compact" hide-details></v-select>
        </div>
      </div>
      <div class="mt-6">
        <apexchart type="bar" height="370px" :options="chartOptions.chartOptions" :series="chartOptions.series">
        </apexchart>
      </div>
    </v-card-item>
  </v-card>
</template>
