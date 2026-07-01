<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../../stores/auth/useAuthStore.js'

// 스토어 및 라우터 초기화
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

// 스크롤 여부
const isScrolled = ref(false)

// 로그아웃 후 홈으로 이동
function handleLogout() {
  authStore.logout()
  router.push('/')
}

// 스크롤 이벤트
function handleScroll() {
  isScrolled.value = window.scrollY > 4
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <header :class="['header', { 'header--scrolled': isScrolled }]">
    <div class="header-inner container">
      <!-- 로고 -->
      <RouterLink to="/" class="header-logo">
        <img
          src="/src/assets/images/sangdari-logo.png"
          alt="상다리"
          class="header-logo-img"
        />
      </RouterLink>

      <!-- 내비게이션 -->
      <nav class="header-nav">
        <!-- 로그인 상태일 때 -->
        <template v-if="authStore.isLoggedIn">
          <RouterLink
            to="/my-requests"
            :class="[
              'nav-link',
              { 'nav-link--active': route.path.startsWith('/my-requests') }
            ]"
          >
            내 요청
          </RouterLink>

          <RouterLink
            to="/users/info"
            :class="[
              'nav-link',
              { 'nav-link--active': route.path === '/users/info' }
            ]"
          >
            마이페이지
          </RouterLink>

          <button
            type="button"
            class="header-logout-btn"
            @click="handleLogout"
          >
            로그아웃
          </button>
        </template>

        <!-- 비로그인 상태일 때 -->
        <template v-else>
          <RouterLink
            to="/auth/login"
            :class="[
              'header-login-btn',
              { 'auth-link--active': route.path === '/auth/login' }
            ]"
          >
            로그인
          </RouterLink>

          <RouterLink
            to="/users/signup"
            :class="[
              'header-signup-btn',
              { 'auth-link--active': route.path === '/users/signup' }
            ]"
          >
            회원가입
          </RouterLink>
        </template>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
  box-shadow: none;
  transition: box-shadow var(--transition-base);
}

.header--scrolled {
  box-shadow: 0 2px 12px rgba(15, 23, 42, 0.08);
}

.header-inner {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-logo {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.header-logo-img {
  height: 44px;
  width: auto;
  display: block;
}

.header-nav {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

/* 로그인 후 일반 메뉴 */
.nav-link {
  padding: 8px 14px;
  border-radius: var(--radius-md);
  color: var(--color-text-sub);
  font-size: var(--text-md);
  font-weight: 700;
  text-decoration: none;
  transition:
    background var(--transition-fast),
    color var(--transition-fast);
}

.nav-link:hover {
  background: #fff7ed;
  color: var(--color-primary);
}

.nav-link--active {
  background: #ffedd5;
  color: var(--color-primary);
}

/* 비로그인 상태: 로그인 버튼 */
.header-login-btn {
  padding: 8px 16px;
  border-radius: var(--radius-md);
  border: 1.5px solid var(--color-border);
  background: var(--color-white);
  color: var(--color-text-sub);
  font-size: var(--text-md);
  font-weight: 700;
  text-decoration: none;
  transition:
    background var(--transition-fast),
    color var(--transition-fast),
    border-color var(--transition-fast);
}

.header-login-btn:hover {
  border-color: var(--color-primary);
  background: #fff7ed;
  color: var(--color-primary);
}

/* 비로그인 상태: 회원가입 버튼 */
.header-signup-btn {
  padding: 8px 18px;
  border-radius: var(--radius-md);
  background: var(--color-primary);
  color: var(--color-white);
  font-size: var(--text-md);
  font-weight: 800;
  text-decoration: none;
  box-shadow: var(--shadow-primary);
  transition:
    background var(--transition-fast),
    transform var(--transition-fast);
}

.header-signup-btn:hover {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
}

.auth-link--active {
  border-color: var(--color-primary);
}

/* 로그아웃 버튼 */
.header-logout-btn {
  margin-left: var(--space-2);
  padding: 8px 16px;
  border-radius: var(--radius-md);
  border: 1.5px solid var(--color-border);
  background: var(--color-white);
  color: var(--color-text-sub);
  font-size: var(--text-md);
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition:
    background var(--transition-fast),
    color var(--transition-fast),
    border-color var(--transition-fast);
}

.header-logout-btn:hover {
  border-color: var(--color-danger);
  background: var(--color-danger-light);
  color: var(--color-danger);
}

@media (max-width: 640px) {
  .header-inner {
    height: auto;
    min-height: 64px;
    padding-top: var(--space-3);
    padding-bottom: var(--space-3);
    gap: var(--space-3);
  }

  .header-logo-img {
    height: 38px;
  }

  .header-nav {
    gap: var(--space-2);
  }

  .nav-link,
  .header-login-btn,
  .header-signup-btn,
  .header-logout-btn {
    padding: 7px 11px;
    font-size: var(--text-sm);
  }
}
</style>
