<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useTheme } from "vuetify";

const theme = useTheme();
const success = theme.current.value.colors.success;
const muted = theme.current.value.colors.muted;
const isDarkTheme = ref(false);
const savedTheme = localStorage.getItem("theme") || "DarkTheme";
isDarkTheme.value = savedTheme === "DarkTheme";
const loggedUser = JSON.parse(localStorage.getItem('loggedUser') || '{}');
const Chart = ref([0, 0]);
const formatCurrency = (amount: number) => {
  return amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

watchEffect(() => {
  const finances = JSON.parse(localStorage.getItem('finances') || '[]').filter((item: any) => item.user_id === loggedUser.id);
  let inTotal = 0;
  let outTotal = 0;

  finances.forEach((item: { type: string, amount: string | number }) => {
    const amount = parseFloat(item.amount.toString());
    if (item.type === 'I') {
      inTotal += amount;
    } else if (item.type === 'O') {
      outTotal += amount;
    }
  });

  Chart.value = [inTotal, outTotal];
});

const chartOptions = computed(() => {
  return {
    labels: ["In", "Out"],
    chart: {
      type: "donut",
      fontFamily: `inherit`,
      foreColor: "#a1aab2",
      toolbar: {
        show: false,
      },
    },
    colors: [success, muted],
    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        donut: {
          size: "75%",
          background: "transparent",
        },
      },
    },
    stroke: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    tooltip: { theme: isDarkTheme.value ? "dark" : "light", fillSeriesColor: false },
  };
});
</script>

<template>
  <v-card elevation="10" class="withbg">
    <v-card-item>
      <div class="d-sm-flex align-center justify-space-between pt-sm-2">
        <v-card-title class="text-h5">Total Gains</v-card-title>
      </div>
      <v-row>
        <v-col cols="7" sm="7">
          <div class="mt-6">
            <h3 class="text-h3">
              {{ formatCurrency(Chart[0] - Chart[1]) }}
            </h3>
            <div class="mt-1">
              <v-avatar :class="{
                'bg-neutral': Chart[0] - Chart[1] === 0,
                'bg-lightsuccess text-success': Chart[0] - Chart[1] > 0,
                'bg-lighterror': Chart[0] - Chart[1] < 0
              }" size="25">
                <template v-if="Chart[0] - Chart[1] > 0">
                  <ArrowUpLeftIcon size="20" />
                </template>
                <template v-else-if="Chart[0] - Chart[1] < 0">
                  <ArrowDownLeftIcon size="20" />
                </template>
                <template v-else>
                  <v-icon size="20">mdi-circle-outline</v-icon> <!-- Ícone neutro -->
                </template>
              </v-avatar>
              <span class="text-subtitle-1 ml-2 font-weight-bold">
                {{ Chart[0] - Chart[1] > 0 ? "Good gains" : Chart[0] - Chart[1] < 0 ? "Losses" : "Neutral" }} </span>
                  <span class="text-subtitle-1 text-muted ml-2">overall</span>
            </div>
            <div class="d-flex align-center mt-sm-10 mt-8">
              <h6 class="text-subtitle-1 text-muted">
                <v-icon icon="mdi mdi-checkbox-blank-circle" class="mr-1" size="10" color="success"></v-icon>
                In
              </h6>
              <h6 class="text-subtitle-1 text-muted pl-5">
                <v-icon icon="mdi mdi-checkbox-blank-circle" class="mr-1" size="10" color="muted"></v-icon>
                Out
              </h6>
            </div>
          </div>
        </v-col>
        <v-col cols="5" sm="5" class="pl-lg-0">
          <div class="d-flex align-center flex-shrink-0">
            <apexchart class="pt-6" type="donut" height="145" :options="chartOptions" :series="Chart">
            </apexchart>
          </div>
        </v-col>
      </v-row>
    </v-card-item>
  </v-card>
</template>