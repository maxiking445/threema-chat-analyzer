import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/main.css";
import VueWordCloud from "vuewordcloud";
import VueApexCharts from "vue3-apexcharts";

createApp(App).use(router).use(VueWordCloud).use(VueApexCharts).mount("#app");
