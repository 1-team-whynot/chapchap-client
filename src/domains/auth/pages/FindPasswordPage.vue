<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../../stores/auth/useAuthStore.js'
import { useErrorStore } from '../../../stores/error/useErrorStore.js'
import { email, name, password, passwordChk, phone } from '../../user/rule/userRule.js'
import AuthInputComponent from '../components/AuthInputComponent.vue'
import BaseButton from '../../common/components/BaseButton.vue'

const router = useRouter()
const authStore = useAuthStore()
const errorStore = useErrorStore()

const step = ref(1) // 1: 회원정보 확인, 2: 새 비밀번호 변경
const isLoading = ref(false)
const errorMessage = ref('')

const form = reactive({
  email: '',
  name: '',
  phone: '',
  newPassword: '',
  newPasswordChk: ''
})

const isStep1Complete = computed(() => {
  return (
    form.email.trim() !== '' &&
    form.name.trim() !== '' &&
    form.phone.trim() !== ''
  )
})

const isStep2Complete = computed(() => {
  return (
    form.newPassword.trim() !== '' &&
    form.newPasswordChk.trim() !== ''
  )
})

// Step 1: 회원 정보 일치 여부 확인
const handleVerify = async () => {
  errorMessage.value = ''

  // 유효성 검증
  const emailErr = email(form.email)
  if (emailErr) {
    errorMessage.value = emailErr
    return
  }

  const nameErr = name(form.name)
  if (nameErr) {
    errorMessage.value = nameErr
    return
  }

  const phoneErr = phone(form.phone)
  if (phoneErr) {
    errorMessage.value = phoneErr
    return
  }

  isLoading.value = true
  try {
    const payload = {
      email: form.email.trim(),
      name: form.name.trim(),
      phone: form.phone.trim()
    }
    
    await authStore.verifyUser(payload)
    step.value = 2 // 다음 단계로 이동
  } catch (error) {
    if (error.response?.data?.code === 'E02') {
      errorMessage.value = '입력하신 정보와 일치하는 회원을 찾을 수 없습니다.'
    } else if (error.response?.data?.message) {
      errorMessage.value = error.response.data.message
    } else {
      errorMessage.value = '회원 정보 확인 중 오류가 발생했습니다.'
    }
    errorStore.setErrorInfo(error)
  } finally {
    isLoading.value = false
  }
}

// Step 2: 새 비밀번호로 변경
const handleSubmit = async () => {
  errorMessage.value = ''

  const pwdErr = password(form.newPassword)
  if (pwdErr) {
    errorMessage.value = pwdErr === '이메일과 비밀번호를 입력해주세요.' ? '비밀번호를 입력해주세요.' : pwdErr
    return
  }

  const pwdChkErr = passwordChk(form.newPassword, form.newPasswordChk)
  if (pwdChkErr) {
    errorMessage.value = pwdChkErr
    return
  }

  isLoading.value = true
  try {
    const payload = {
      email: form.email.trim(),
      name: form.name.trim(),
      phone: form.phone.trim(),
      newPassword: form.newPassword.trim()
    }
    
    await authStore.resetPassword(payload)
    alert('비밀번호가 성공적으로 변경되었습니다. 다시 로그인해주세요.')
    router.replace('/auth/login')
  } catch (error) {
    if (error.response?.data?.code === 'E02') {
      errorMessage.value = '입력하신 정보와 일치하는 회원을 찾을 수 없습니다.'
    } else if (error.response?.data?.message) {
      errorMessage.value = error.response.data.message
    } else {
      errorMessage.value = '비밀번호 재설정 중 오류가 발생했습니다.'
    }
    errorStore.setErrorInfo(error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="find-pwd-container">
    <div class="find-pwd-inner">
      <h2 class="find-pwd-title">비밀번호 찾기</h2>
      <p class="find-pwd-desc">
        {{ step === 1 ? '회원 가입 정보와 동일하게 입력해주세요.' : '변경하실 새 비밀번호를 입력해주세요.' }}
      </p>
      
      <!-- Step 1: 회원정보 확인 폼 -->
      <form v-if="step === 1" @submit.prevent="handleVerify" class="find-pwd-form">
        <div class="input-container">
          <AuthInputComponent
            v-model="form.email"
            label="이메일"
            type="email"
            placeholder="example@email.com"
            require
          />
        </div>

        <div class="input-container">
          <AuthInputComponent
            v-model="form.name"
            label="이름"
            placeholder="이름 입력 (2 ~ 40자 이내)"
            require
          />
        </div>
        
        <div class="input-container">
          <AuthInputComponent
            v-model="form.phone"
            label="연락처"
            type="tel"
            placeholder="하이픈(-) 없이 숫자만 입력 (11자리)"
            require
          />
        </div>
        
        <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>
        
        <div class="btn-group">
          <BaseButton
            type="button"
            variant="ghost"
            class="back-btn"
            @click="router.back()"
          >
            취소
          </BaseButton>
          
          <BaseButton
            type="submit"
            variant="primary"
            class="submit-btn"
            :disabled="!isStep1Complete || isLoading"
          >
            확인
          </BaseButton>
        </div>
      </form>

      <!-- Step 2: 새 비밀번호 입력 폼 -->
      <form v-else-if="step === 2" @submit.prevent="handleSubmit" class="find-pwd-form">
        <!-- 확인 완료된 정보 (참조용 Readonly 표시) -->
        <div class="verified-info-summary">
          <div class="summary-item"><strong>이메일:</strong> <span>{{ form.email }}</span></div>
          <div class="summary-item"><strong>이름:</strong> <span>{{ form.name }}</span></div>
          <div class="summary-item"><strong>연락처:</strong> <span>{{ form.phone }}</span></div>
        </div>

        <div class="input-container">
          <AuthInputComponent
            v-model="form.newPassword"
            label="새 비밀번호"
            type="password"
            placeholder="대/소문자, 숫자, 특수문자 6 ~ 20자 이내"
            require
          />
        </div>
        
        <div class="input-container">
          <AuthInputComponent
            v-model="form.newPasswordChk"
            label="새 비밀번호 확인"
            type="password"
            placeholder="새 비밀번호 재입력"
            require
          />
        </div>
        
        <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>
        
        <div class="btn-group">
          <BaseButton
            type="button"
            variant="ghost"
            class="back-btn"
            @click="step = 1"
          >
            이전
          </BaseButton>
          
          <BaseButton
            type="submit"
            variant="primary"
            class="submit-btn"
            :disabled="!isStep2Complete || isLoading"
          >
            비밀번호 변경
          </BaseButton>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.find-pwd-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.find-pwd-inner {
  width: 400px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.find-pwd-title {
  font-size: var(--text-5xl);
  font-weight: 800;
  color: var(--color-text);
  margin-bottom: 4px;
}

.find-pwd-desc {
  font-size: var(--text-xs);
  color: var(--color-text-sub);
}

.find-pwd-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.input-container {
  display: flex;
  flex-direction: column;
}

.error-msg {
  font-size: var(--text-sm);
  color: #EF4444;
  text-align: center;
}

.btn-group {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.back-btn,
.submit-btn {
  flex: 1;
}

/* 확인된 회원 정보 요약 박스 */
.verified-info-summary {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  font-size: var(--text-base);
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: var(--color-text-sub);
}

.summary-item {
  display: flex;
  justify-content: space-between;
}

.summary-item strong {
  color: var(--color-text);
}
</style>
