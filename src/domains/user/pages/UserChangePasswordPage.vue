<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import ChangePasswordValidator from '../util/ChangePasswordValidator'
import { useUserStore } from '../../../stores/user/useUserStore.js'

// 공용/회원가입 컴포넌트 임포트
import BaseButton from '../../common/components/BaseButton.vue'
import AuthInputComponent from '../../auth/components/AuthInputComponent.vue'

const router = useRouter()
const userStore = useUserStore()

const step = ref(1) // 1: 현재 비밀번호 확인, 2: 새 비밀번호 변경
const isLoading = ref(false)
const errorMessage = ref('')

const formData = reactive({ currentPassword: '', newPassword: '', newPasswordConfirm: '' })

const handleVerify = async () => {
  if (!formData.currentPassword) {
    errorMessage.value = '현재 비밀번호를 입력해주세요.'
    return
  }

  try {
    isLoading.value = true
    errorMessage.value = ''
    
    await userStore.verifyPassword({
      currentPassword: formData.currentPassword
    })
    
    step.value = 2 // 2단계로 이동
  } catch (error) {
    if (error.response?.data?.code === 'E34') {
      errorMessage.value = '현재 비밀번호가 일치하지 않습니다.'
    } else {
      errorMessage.value = '비밀번호 확인 중 오류가 발생했습니다.'
    }
  } finally {
    isLoading.value = false
  }
}

const handleChange = async () => {
  const isPasswordValid = ChangePasswordValidator.password(formData.newPassword);
  const isPasswordChkValid = ChangePasswordValidator.passwordChk(formData.newPassword, formData.newPasswordConfirm);
  
  if (isPasswordValid || isPasswordChkValid) {
    errorMessage.value = isPasswordValid || isPasswordChkValid
    return
  }

  try {
    isLoading.value = true
    errorMessage.value = ''
    
    await userStore.changePassword({
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword
    })
    
    alert('비밀번호가 성공적으로 변경되었습니다. 🔒')
    router.replace('/users/info')
  } catch (error) {
    if (error.response?.data?.code === 'E34') {
      errorMessage.value = '현재 비밀번호가 일치하지 않습니다.'
    } else {
      errorMessage.value = '비밀번호 변경 중 오류가 발생했습니다.'
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="edit-container">
    <h2 class="page-title">비밀번호 변경 🔒</h2>

    <!-- 1단계: 현재 비밀번호 확인 -->
    <form v-if="step === 1" @submit.prevent="handleVerify" class="edit-card">
      <div class="input-list">
        <AuthInputComponent
          label="현재 비밀번호"
          type="password"
          placeholder="현재 비밀번호 입력"
          v-model="formData.currentPassword"
          :require="true"
        />
      </div>

      <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>

      <div class="button-group">
        <BaseButton 
          variant="ghost" 
          type="button"
          @click="router.back()"
          :fullWidth="true"
        >
          취소
        </BaseButton>
        <BaseButton 
          variant="primary" 
          type="submit"
          :disabled="isLoading || !formData.currentPassword"
          :fullWidth="true"
        >
          {{ isLoading ? '확인 중...' : '확인' }}
        </BaseButton>
      </div>
    </form>

    <!-- 2단계: 새 비밀번호 입력 및 변경 -->
    <form v-else-if="step === 2" @submit.prevent="handleChange" class="edit-card">
      <div class="input-list">
        <AuthInputComponent
          label="새 비밀번호"
          type="password"
          placeholder="영문, 숫자, 특수문자 6~20자"
          v-model="formData.newPassword"
          :require="true"
        />

        <AuthInputComponent
          label="새 비밀번호 확인"
          type="password"
          placeholder="새 비밀번호 재입력"
          v-model="formData.newPasswordConfirm"
          :require="true"
        />
      </div>

      <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>

      <div class="button-group">
        <BaseButton 
          variant="ghost" 
          type="button"
          @click="step = 1"
          :fullWidth="true"
        >
          이전
        </BaseButton>
        <BaseButton 
          variant="primary" 
          type="submit"
          :disabled="isLoading || !formData.newPassword || !formData.newPasswordConfirm"
          :fullWidth="true"
        >
          {{ isLoading ? '변경 중...' : '변경하기' }}
        </BaseButton>
      </div>
    </form>
  </div>
</template>

<style scoped>
.edit-container { 
  max-width: 480px; 
  margin: 60px auto; 
  padding: 0 20px; 
}
.page-title { 
  font-size: 28px; 
  font-weight: 800; 
  color: #2B2119; 
  margin-bottom: 24px; 
}
.edit-card { 
  background: #FFFFFF; 
  border-radius: 20px; 
  padding: 32px; 
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.04); 
}
.input-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}
.error-msg { 
  font-size: 13px; 
  color: #D5402A; 
  text-align: center; 
  margin-top: 16px; 
  margin-bottom: 16px;
}
.button-group { 
  display: flex; 
  gap: 12px; 
  margin-top: 20px; 
}
.button-group > * {
  flex: 1;
}
</style>