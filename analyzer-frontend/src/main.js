import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/main.css";
import VueWordCloud from "vuewordcloud";
import VueApexCharts from "vue3-apexcharts";
import Vue3Toastify from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import { library } from "@fortawesome/fontawesome-svg-core";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faArrowLeft);

createApp(App)
  .use(router)
  .use(Vue3Toastify, {
    position: "top-center",
    timeout: 3000,
    theme: 'colored',
    pauseOnHover: true,
  })
  .use(VueWordCloud)
  .use(VueApexCharts)
  .component("font-awesome-icon", FontAwesomeIcon)
  .mount("#app");