import { createRouter, createWebHistory } from 'vue-router'

import LoginPage from '../domains/auth/pages/LoginPage.vue'
import SignupPage from '../domains/auth/pages/SignupPage.vue'

import PaymentPage from '../domains/payment/pages/PaymentPage.vue'
import PaymentSuccessPage from '../domains/payment/pages/PaymentSuccessPage.vue'
import PaymentFailPage from '../domains/payment/pages/PaymentFailPage.vue'
import PaymentCompletePage from '../domains/payment/pages/PaymentCompletePage.vue'

import { useAuthStore } from '../stores/auth/useAuthStore.js'
import HomePage from '../domains/home/HomePage.vue'
import UserInfoPage from '../domains/user/pages/UserInfoPage.vue'
import UserUpdateInfoPage from '../domains/user/pages/UserUpdateInfoPage.vue'
import { patchProp } from 'vue'
import UserChangePasswordPage from '../domains/user/pages/UserChangePasswordPage.vue'
import UserWithdrawPage from '../domains/user/pages/UserWithdrawPage.vue'
import ChecklistPage from '../domains/checklist/pages/checklistPage.vue'
import StoreListPage from '../domains/store/pages/StoreListPage.vue'
import StoreDetailPage from '../domains/store/pages/StoreDetailPage.vue'
import ReservationCreatePage from '../domains/reservation/pages/ReservationCreatePage.vue'
import MyRequestsPage from '../domains/myRequest/pages/MyRequestsPage.vue'
import FindPasswordPage from '../domains/auth/pages/FindPasswordPage.vue'

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

  // 체크리스트
  {
    path: '/checklist',
    name: 'Checklist',
    component: ChecklistPage,
    meta: setMeta(false, false),
  },

  // 업체 목록
  {
    path: '/storelist',
    name: 'StoreList',
    component: StoreListPage,
    meta: setMeta(false, false),
  },
  {
    path: '/stores/:storeId',
    name: 'StoreDetail',
    component: StoreDetailPage,
    meta: setMeta(false, false),
  },
  {
    path: '/reservation/create',
    name: 'ReservationCreate',
    component: ReservationCreatePage,
    meta: setMeta(true, false),
  },
  {
    path: '/my-requests',
    name: 'MyRequests',
    component: MyRequestsPage,
    meta: setMeta(true, false),
  },

  // 비밀번호 찾기
  {
    path: '/auth/find-password',
    name: 'FindPassword',
    component: FindPasswordPage,
    meta: setMeta(false, true), // 비로그인 전용 페이지
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

  // 내 정보 조회
  {
    path: '/users/info',
    name: 'Info',
    component: UserInfoPage,
    meta: setMeta(true, false)
  },

  // 내 정보 수정
  {
    path: '/users/info-update',
    name: 'UpdateInfo',
    component: UserUpdateInfoPage,
    meta: setMeta(true, false)
  },

  // 비밀번호 변경
  {
    path: '/users/password-change',
    name: 'ChangePassword',
    component: UserChangePasswordPage,
    meta: setMeta(true, false)
  },

  // 회원 탈퇴
  {
    path: '/users/withdraw',
    name: 'withdraw',
    component: UserWithdrawPage,
    meta: setMeta(true, false)
  },

  // 결제
  {
    path: '/payment',
    name: 'Payment',
    component: PaymentPage,
    meta: setMeta(true, false),
  },
  {
    path: '/payment/success',
    name: 'PaymentSuccess',
    component: PaymentSuccessPage,
    meta: setMeta(true, false),
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
    meta: setMeta(true, false),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const getSafeRedirectPath = (redirect) => {
  if (typeof redirect !== 'string') return ''
  if (!redirect.startsWith('/') || redirect.startsWith('//')) return ''
  return redirect
}

const createLoginRedirect = (to) => ({
  path: '/auth/login',
  query: {
    redirect: to.fullPath,
  },
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  // 1. 메모리는 날아갔지만(새로고침), localStorage에 로그인 흔적이 있다면 무조건 재발급 시도!
  // (결제 성공 페이지처럼 로그인 필수 페이지가 아니더라도 재발급을 받아와야 상단바가 '로그아웃'으로 유지됩니다)
  if (!authStore.isLoggedIn && localStorage.getItem('isLogin') === 'true') {
    try {
      await authStore.reissue()
    } catch(error) {
      // 재발급 실패 시(리프레시 토큰 만료 등) 찌꺼기 삭제
      authStore.clearAuthStore()
      
      // 만약 가려던 곳이 로그인 필수 페이지였다면 로그인 창으로 쫓아냄
      if (to.meta.isAuthenticated) {
        alert('로그인 시간이 만료되었습니다.\n다시 로그인 해주십시오.')
        return createLoginRedirect(to)
      }
    }
  }

  // 2. 위 과정을 거쳤는데도 여전히 로그아웃 상태일 때, 로그인 필수 페이지에 접근하려 한다면 차단
  if (to.meta.isAuthenticated && !authStore.isLoggedIn) {
    alert('로그인이 필요한 서비스입니다.')
    return createLoginRedirect(to)
  }

  // 3. 이미 로그인했는데, 게스트 전용 페이지(로그인, 회원가입)에 접근하려 한다면 홈으로!
  if (to.meta.isGuestOnly && authStore.isLoggedIn) {
    return getSafeRedirectPath(to.query.redirect) || '/'
  }
})

export default router
