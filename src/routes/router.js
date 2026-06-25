import { createRouter, createWebHistory } from "vue-router";
import ChecklistPage from "../domains/checklist/pages/ChecklistPage.vue";
import StoreListPage from "../domains/store/pages/StoreListPage.vue";

const routes = [
  {
    path: '/checklist',
    component: ChecklistPage,
  },
  {
    path: '/storelist',
    component: StoreListPage,
  }

];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;