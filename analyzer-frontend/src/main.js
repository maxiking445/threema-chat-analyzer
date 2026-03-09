import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/main.css";
import VueWordCloud from "vuewordcloud";
import VueApexCharts from "vue3-apexcharts";
import Vue3Toastify from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faArrowLeft,
  faTrash,
  faFileZipper,
  faDownload,
  faFilePdf,
  faCode,
  faHome,
  faChartBar,
  faComments,
  faBars,
  faAnglesLeft
} from "@fortawesome/free-solid-svg-icons";
import { LoadingPlugin } from "vue-loading-overlay";
import "vue-loading-overlay/dist/css/index.css";

library.add(faArrowLeft, faTrash, faFileZipper, faDownload, faFilePdf, faCode, faHome, faChartBar, faComments, faBars, faAnglesLeft);

createApp(App)
  .use(router)
  .use(LoadingPlugin)
  .use(Vue3Toastify, {
    position: "top-center",
    timeout: 3000,
    theme: "colored",
    pauseOnHover: true,
  })
  .use(VueApexCharts)
  .component("VueWordCloud", VueWordCloud)
  .component("font-awesome-icon", FontAwesomeIcon)
  .mount("#app");
