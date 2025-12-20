import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import VueWordCloud from 'vuewordcloud';

createApp(App)
  .use(router)
  .use(VueWordCloud)
  .mount('#app')
