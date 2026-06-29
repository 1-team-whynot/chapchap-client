import { createRouter, createWebHistory } from 'vue-router'

import LoginPage from '../domains/auth/pages/LoginPage.vue'
import SignupPage from '../domains/auth/pages/SignupPage.vue'

import PaymentPage from '../domains/payment/pages/PaymentPage.vue'
import PaymentSuccessPage from '../domains/payment/pages/PaymentSuccessPage.vue'
import PaymentFailPage from '../domains/payment/pages/PaymentFailPage.vue'
import PaymentCompletePage from '../domains/payment/pages/PaymentCompletePage.vue'

import { useAuthStore } from '../stores/auth/useAuthStore.js'
import HomePage from '../domains/home/HomePage.vue'

const setMeta = (isAuthenticated, isGuestOnly) => {
  return {
    isAuthenticated,
    isGuestOnly,
  }
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
    meta: setMeta(false, false),
  },

  // 로그인
  {
    path: '/auth/login',
    name: 'Login',
    component: LoginPage,
    meta: setMeta(false, true),
  },

  // 회원가입
  {
    path: '/users/signup',
    name: 'Signup',
    component: SignupPage,
    meta: setMeta(false, true),
  },

  // 결제
  {
    path: '/payment',
    name: 'Payment',
    component: PaymentPage,
    meta: setMeta(false, false),
  },
  {
    path: '/payment/success',
    name: 'PaymentSuccess',
    component: PaymentSuccessPage,
    meta: setMeta(false, false),
  },
  {
    path: '/payment/fail',
    name: 'PaymentFail',
    component: PaymentFailPage,
    meta: setMeta(false, false),
  },
  {
    path: '/payment/complete',
    name: 'PaymentComplete',
    component: PaymentCompletePage,
    meta: setMeta(false, false),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  if (!authStore.isLoggedIn) {
    try {
      await authStore.reissue();
    } catch(error) {
      alert('로그인 시간이 만료되었습니다.\n다시 로그인 해주십시오.');
      return next('/auth/login');
    }
  }

  if (to.meta.isAuthenticated && !authStore.isLoggedIn) {
    return next('/auth/login')
  }

  if (to.meta.isGuestOnly && authStore.isLoggedIn) {
    return next('/')
  }

  next()
})

export default router
