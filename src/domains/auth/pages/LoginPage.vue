<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../../stores/auth/useAuthStore.js'
import { useErrorStore } from '../../../stores/error/useErrorStore.js'
import loginValidator from '../utils/loginValidator.js'
import AuthInputComponent from '../components/AuthInputComponent.vue'
import BaseButton from '../../common/components/BaseButton.vue'

const router    = useRouter()
const authStore = useAuthStore()
const errorStore = useErrorStore()

// 현재 화면 ('user' | 'owner')
const screen = ref('user')

// 탭 전환 핸들러 추가
const handleTabChange = (type) => {
  screen.value = type;
  
  // 입력 폼 및 에러 상태 클리어
  userLogin.email = '';
  userLogin.password = '';
  userLogin.error = '';
};


// ── 상태 관리 ───────────────
const isLoading = ref(false);
const userLogin = reactive({
  email: ''
  , password: ''
  , error: ''
});

// ── 로그인 폼 제출 핸들러 ────────────
const handleSubmit = async () => {
  // 1. 제출 시 기존 에러 메시지 초기화
  userLogin.error = '';

  // 2. 외부 파일의 유효성 검사 함수 실행
  const isEmailValid = loginValidator.email(userLogin.email);
  const isPasswordValid = loginValidator.password(userLogin.password);

  // 3. 검사 결과에 따른 에러 메시지 바인딩 (실패 시 즉시 종료)
  if (isEmailValid) {
    userLogin.error = isEmailValid;
    return;
  }
  
  if (isPasswordValid) {
    userLogin.error = isPasswordValid;
    return;
  }

  // 4. 유효성 검사 통과 시 API 호출
  isLoading.value = true;
  try {
    await authStore.login(userLogin);
    router.replace('/');
  } catch (error) {
    if(error.response) {
      if(error.response?.data?.code === 'E21') {
        userLogin.error = error.response.data.data;
      } else {
        userLogin.error = error.response.data.message || '로그인 정보가 올바르지 않습니다.';
      }
    } else {
      userLogin.error = '서버와 연결할 수 없습니다. 네트워크를 확인해 주세요.';
    }
    errorStore.setErrorInfo(error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="login-container" :class="{ 'owner-theme': screen === 'owner' }">
    <div class="login-inner">
      <!-- 탭 전환 버튼 -->
      <div class="tabs">
        <button
          :class="['tab-btn', { 'tab-btn-active': screen === 'user' }]"
          @click="handleTabChange('user')"
        >
          고객
        </button>
        <button
          :class="['tab-btn', { 'tab-btn-active': screen === 'owner' }]"
          @click="handleTabChange('owner')"
        >
          업체
        </button>
      </div>

      <!-- 고객 폼 -->
      <div v-if="screen === 'user'" class="form-container">
        <h2 class="auth-login-title">다시 만나서 반가워요 👋🏻</h2>

        <div v-if="userLogin.error" class="error-text">{{ userLogin.error }}</div>

        <form @submit.prevent="handleSubmit" class="login-form">
          <div class="input-container">
            <AuthInputComponent
              v-model="userLogin.email"
              :label="'이메일'"
              :type="'email'"
              :placeholder="'example@email.com'"
              :color="'navy'"
            />
          </div>

          <div class="input-container">
            <AuthInputComponent
              v-model="userLogin.password"
              label="비밀번호"
              type="password"
              placeholder="비밀번호 입력"
            />
          </div>

          <BaseButton
           type="submit"
           variant="primary" 
           full-width 
           class="login-btn"
           >
            로그인
          </BaseButton>

          <div class="auth-links">
            <router-link to="/auth/find-password" class="link-text">비밀번호 찾기</router-link>
            <span class="divider">|</span>
            <router-link to="/users/signup" class="link-text">회원가입</router-link>
          </div>
        </form>
      </div>

      <!-- 점주 폼 -->
      <div v-else class="form-container">
        <h2 class="auth-login-title">다시 만나서 반가워요 👋🏻</h2>

        <div v-if="userLogin.error" class="error-text">{{ userLogin.error }}</div>

        <form @submit.prevent="handleSubmit" class="login-form">
          <div class="input-container">
            <AuthInputComponent
              v-model="userLogin.email"
              label="이메일"
              type="email"
              placeholder="example@email.com"
            />
          </div>

          <div class="input-container">
            <AuthInputComponent
              v-model="userLogin.password"
              label="비밀번호"
              type="password"
              placeholder="비밀번호 입력"
            />
          </div>

          <BaseButton
           type="submit"
           variant="primary" 
           full-width 
           class="login-btn"
           >
            로그인
          </BaseButton>

          <div class="auth-links">
            <router-link to="/auth/find-password" class="link-text">비밀번호 찾기</router-link>
            <span class="divider">|</span>
            <router-link to="/owners/signup" class="link-text">회원가입</router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.login-inner {
  width: var(--w-xs);
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.tabs {
  padding: 5px;
  display: flex;
  justify-content: center;
  gap: 5px;
  border-radius: var(--radius-lg);
  /* background-color: #eee; */
}

.tab-btn {
  flex: 1 0 100px;
  padding: 15px 0;
  color: var(--color-primary);
  border: none;
  /* border: 1px solid var(--color-primary); */
  border-radius: 10px;
  background-color: var(--color-white);
  cursor: pointer;
}

.tab-btn-active {
  color: var(--color-white);
  /* border: 1px solid var(--color-primary); */
  border-bottom: 0;
  background-color: var(--color-primary);
  transition: all 0.2s ease;
}

.form-container {
  padding: 60px 80px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  /* border: 1px solid var(--color-primary); */
  border-radius: 15px;
  background-color: var(--color-white);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.auth-login-title {
  font-size: var(--text-3xl);
  font-weight: 800;
  color: var(--color-text);
  margin-bottom: 4px;
}

.error-text {
  padding: 10px;
  font-weight: 700;
  font-size: 0.8rem;
  text-align: center;
  color: var(--color-danger-text);
  border: 1px solid var(--color-danger-border);
  border-radius: var(--radius-lg);
  background-color: var(--color-danger-light);
}

.login-form {
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.login-btn {
  margin-top: 10px;
}

/* 하단 링크 (비밀번호 찾기 | 회원가입) */
.auth-links {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  font-size: 0.9rem;
}

.link-text {
  color: var(--color-text-muted);
  text-decoration: none;
}

.link-text:hover {
  color: var(--color-primary-hover);
}

.divider {
  margin: 0 15px;
  color: var(--color-accent);
}

.owner-theme {
  --color-primary: var(--color-navy);
  --color-primary-hover: var(--color-navy-dark);
  --color-accent: var(--color-lavender);
}
</style>
