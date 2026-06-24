import { createRouter, createWebHistory } from "vue-router";
import ChecklistPage from "../domains/checklist/pages/checklistPage.vue";

const routes = [
  {
    path: '/checklist',
    component: ChecklistPage,
  },

];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;