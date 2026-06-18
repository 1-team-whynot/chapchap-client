import { createRouter, createWebHistory } from 'vue-router';
import RegistrationSelectPage from '../pages/auth/RegistrationSelectPage.vue';
import RegistrationUserPage from '../pages/auth/RegistrationUserPage.vue';
import RegistrationOwnerPage from '../pages/auth/RegistrationOwnerPage.vue';

const routes = [
  {
    path: '/', 
    component: () => import('../views/HomeView.vue'),
  },
  // 회원가입 관련
  {
    path: '/registration/select',
    component: RegistrationSelectPage,
  },
  {
    path: '/users/registration',
    component: RegistrationUserPage,
  },
  {
    path: '/owners/registration',
    component: RegistrationOwnerPage
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;