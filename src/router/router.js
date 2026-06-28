import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../domains/auth/pages/LoginPage.vue';
import { useAuthStore } from '../stores/auth/useAuthStore.js';
import SignupPage from '../domains/auth/pages/SignupPage.vue';

const setMeta = (isAuthrenticated, isGuestOnly) => {
  return {
    isAuthrenticated
    , isGuestOnly
  }
}

const routes = [
  {
    path: '/'
    // , component: 
    // , redirect: '/user/main'
    , meta: setMeta(false, false)
  },

  // 로그인 관련
  {
    path: '/auth/login'
    , component: LoginPage
    , meta: setMeta(false, true)
  },

  // 회원가입 관련
  {
    path: '/users/signup'
    , component: SignupPage
    , meta: setMeta(false, true)
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to, from, next) => {
  // authStore
  const authStore = useAuthStore();

  if(!authStore.isLoggedIn) {
    try {
      await authStore.reissue();
    } catch(error) {
      
    }
  }

  if(to.meta.isAuthrenticated && !authStore.isLoggedIn) {
    return next('/auth/login');
  }

  if(to.meta.isGuestOnly && authStore.isLoggedIn) {
    return next('/');
  }

  next();
});

export default router;