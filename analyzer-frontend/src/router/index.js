import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../HomeView.vue";
import AnalyzeView from "../AnalyzeView.vue";
import InitView from "@/InitView.vue";
import ChatView from "@/ChatView.vue";
import { dataCache } from "@/service/DataLoadService";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/view",
    name: "view",
    component: AnalyzeView,
    meta: { requiresData: true },
  },
  {
    path: "/init",
    name: "init",
    component: InitView,
  },
  {
    path: "/chat",
    name: "chat",
    component: ChatView,
    meta: { requiresData: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
router.beforeEach((to, from) => {
  if (!from.name && to.path !== "/") {
    return "/";
  }
  if (to.meta.requiresData && !dataCache.isLoaded()) {
    return "/";
  }
  return true;
});

export default router;
