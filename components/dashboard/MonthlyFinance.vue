<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useTheme } from "vuetify";
const theme = useTheme();
const success = theme.current.value.colors.success;
const isDarkTheme = ref(false);
const savedTheme = localStorage.getItem("theme") || "DarkTheme";
isDarkTheme.value = savedTheme === "DarkTheme";
const loggedUser = JSON.parse(localStorage.getItem('loggedUser') || '{}');
const props = defineProps<{ selectedMonth: string, selectedGroup: any }>(); 

const totalFinance = ref<number>(0); 
const financeByDay = ref<number[]>([]); 

const formatCurrency = (amount: number) => {
  return amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

watchEffect(() => {
  const storedData = localStorage.getItem('finances') || '[]';
  const allTransactions = JSON.parse(storedData).filter((item: any) => item.user_id === loggedUser.id);

  const [monthName, year] = props.selectedMonth.split(" ");
  const monthIndex = new Date(`${monthName} 1, 2000`).getMonth(); 
  const selectedYear = parseInt(year);

  const daysInMonth = new Date(selectedYear, monthIndex + 1, 0).getDate();
  financeByDay.value = Array(daysInMonth).fill(0);

  const filteredTransactions = allTransactions.filter((transaction: any) => {
    const transactionDateParts = transaction.date.split('/'); 
    const transactionDate = new Date(
      parseInt(transactionDateParts[2]), 
      parseInt(transactionDateParts[1]) - 1, 
      parseInt(transactionDateParts[0]) 
    );

    if (!props.selectedGroup) {
      return transactionDate.getMonth() === monthIndex && transactionDate.getFullYear() === selectedYear;
    }
    return transactionDate.getMonth() === monthIndex && transactionDate.getFullYear() === selectedYear && transaction.group_id === props.selectedGroup?.id;
  });

  totalFinance.value = filteredTransactions.reduce((acc: number, transaction: any) => {
    const amount = parseFloat(transaction.amount);
    const transactionDay = parseInt(transaction.date.split('/')[0]) - 1;

    financeByDay.value[transactionDay] += (transaction.type === 'I' ? amount : -amount);
    return acc + (transaction.type === 'I' ? amount : -amount);
  }, 0);
});

const areachartOptions = computed(() => {
  return {
    chart: {
      type: "area",
      height: 60,
      fontFamily: `inherit`,
      foreColor: "#a1aab2",
      toolbar: {
        show: false,
      },
      sparkline: {
        enabled: true,
      },
      group: "sparklines",
    },
    toolbar: {
      autoSelected: "pan",
      show: false
    },
    colors: [success],
    stroke: {
      curve: "smooth",
      width: 3,
    },
    fill: {
      type: "solid",
      opacity: 0.05,
    },
    markers: {
      size: 0,
    },
    tooltip: {
      theme: isDarkTheme.value ? "dark" : "light",
      x: {
        show: true,
      },
    },
    
  };
});

const areaChart = computed(() => {
  return {
    series: [
      {
        name: "",
        data: financeByDay.value,
      },
    ],
  };
});
</script>

<template>
  <v-card elevation="10" class="withbg">
    <v-card-item>
      <div class="d-flex align-center justify-space-between pt-sm-2">
        <v-card-title class="text-h5">Monthly Finance</v-card-title>
        <v-btn size="large" icon class="bg-success">
          <v-avatar size="large" class="text-white">
            <CurrencyDollarIcon size="25" />
          </v-avatar>
        </v-btn>
      </div>
      <v-row>
        <v-col cols="12">
          <div class="mt-2">
            <h3 class="text-h3">
              {{ formatCurrency(totalFinance) }}
            </h3>
            <div class="mt-1">
              <v-avatar :class="{
                'bg-neutral': totalFinance === 0,
                'bg-lightsuccess text-success': totalFinance > 0,
                'bg-lighterror': totalFinance < 0
              }" size="25">

                <template v-if="totalFinance === 0">
                  <v-icon size="20">mdi-circle-outline</v-icon>
                </template>
                <template v-else-if="totalFinance > 0">
                  <ArrowUpLeftIcon size="20" />
                </template>
                <template v-else>
                  <ArrowDownLeftIcon size="20" />
                </template>

              </v-avatar>

              <span class="text-subtitle-1 ml-2 font-weight-bold">
                <template v-if="totalFinance === 0">Neutral</template>
                <template v-else-if="totalFinance > 0">Good Gains</template>
                <template v-else>Losses</template>
              </span>
              <span class="text-subtitle-1 text-muted ml-2">this month</span>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-card-item>
    <div class="mt-3">
      <apexchart type="area" height="60" :options="areachartOptions" :series="areaChart.series">
      </apexchart>
    </div>
  </v-card>
</template>
