<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useTheme } from "vuetify";
const theme = useTheme();
const success = theme.current.value.colors.success;
const isDarkTheme = ref(false);
const savedTheme = localStorage.getItem("theme") || "DarkTheme"; 
isDarkTheme.value = savedTheme === "DarkTheme";
const loggedUser = JSON.parse(localStorage.getItem('loggedUser') || '{}');

/* Variables */
const totalFinance = ref<number>(0); // Vai armazenar o total de IN - OUT
const financeByDay = ref<number[]>([]); // Armazenará o valor por dia

// Função para formatar o valor em reais
const formatCurrency = (amount: number) => {
  return amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

/* Get finance data from localStorage */
watchEffect(() => {
  const storedData = localStorage.getItem('finances') || '[]';
  const allTransactions = JSON.parse(storedData).filter((item: any) => item.user_id === loggedUser.id);

  // Pega o mês e ano atual
  const currentMonth = new Date().getMonth(); // Mês atual (0-11)
  const currentYear = new Date().getFullYear(); // Ano atual
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  // Inicializa o array de valores diários com 0s
  financeByDay.value = Array(daysInMonth).fill(0); // Supondo que o mês tenha 31 dias

  // Filtra as transações com base no mês e ano
  const filteredTransactions = allTransactions.filter((transaction: any) => {
    const transactionDateParts = transaction.date.split('/'); // Divide a data no formato DD/MM/YYYY
    const transactionDate = new Date(
      parseInt(transactionDateParts[2]), // Ano
      parseInt(transactionDateParts[1]) - 1, // Mês (0-11)
      parseInt(transactionDateParts[0]) // Dia
    );
    
    return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
  });

  // Calcula o total de "IN" e "OUT" convertendo 'amount' para número
  totalFinance.value = filteredTransactions.reduce((acc: number, transaction: any) => {
    const amount = parseFloat(transaction.amount); // Converte 'amount' para número
    const transactionDateParts = transaction.date.split('/');
    const transactionDay = parseInt(transactionDateParts[0]) - 1; // Pega o dia (0-30)
    
    financeByDay.value[transactionDay] += (transaction.type === 'I' ? amount : -amount);

    return acc + (transaction.type === 'I' ? amount : -amount); // Atualiza o total geral
  }, 0);
});

// Opções do gráfico de área
const areachartOptions = computed(() => {
  const currentMonth = new Date().getMonth(); // Mês atual (0-11)
  const currentYear = new Date().getFullYear(); // Ano atual
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  return {
    labels: Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString()), //
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

// Série de dados para o gráfico de área
const areaChart = computed(() => {
  return {
    series: [
      {
        name: "",
        data: financeByDay.value, // Utiliza os valores por dia
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
