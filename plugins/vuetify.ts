
import { createVuetify } from "vuetify";
import "@mdi/font/css/materialdesignicons.css";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import PerfectScrollbar from 'vue3-perfect-scrollbar';
import VueApexCharts from 'vue3-apexcharts';
import VueTablerIcons from 'vue-tabler-icons';
import '@/scss/style.scss';
import {
  DefaultTheme, DarkTheme
} from "@/theme/Theme";
export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      defaultTheme: "DefaultTheme", 
      themes: {
        DefaultTheme,
        DarkTheme
      },
    }
  });
  nuxtApp.vueApp.use(vuetify);
  nuxtApp.vueApp.use(PerfectScrollbar);
  nuxtApp.vueApp.use(VueApexCharts);
  nuxtApp.vueApp.use(VueTablerIcons);
});

