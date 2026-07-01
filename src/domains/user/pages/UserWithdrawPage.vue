<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../../stores/auth/useAuthStore'

const router = useRouter()
const authStore = useAuthStore()
const password = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

const handleWithdraw = async () => {
  if (!confirm('정말로 탈퇴하시겠습니까? 삭제된 정보는 복구할 수 없습니다.')) return

  try {
    isLoading.value = true
    errorMessage.value = ''
    
    await withdrawApi({ password: password.value })
    
    alert('회원 탈퇴가 완료되었습니다. 이용해 주셔서 감사합니다. 🙇‍♂️')
    authStore.clearAuthStore() // 상태 지우기 및 로그아웃
    router.replace('/')
  } catch (error) {
    const code = error.response?.data?.code
    if (code === 'E34') { // USER_CURRENT_PASSWORD_MISMATCH
      errorMessage.value = '비밀번호가 올바르지 않습니다.'
    } else if (code === 'E33') { // USER_WITHDRAW_BLOCKED
      errorMessage.value = '진행 중인 예약이 있어 탈퇴할 수 없습니다.'
    } else {
      errorMessage.value = '탈퇴 처리 중 오류가 발생했습니다.'
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="withdraw-container">
    <h2 class="page-title">회원 탈퇴</h2>

    <div class="withdraw-card">
      <p class="warning-text">본인 확인을 위해 현재 비밀번호를 입력해 주세요.</p>
      
      <div class="input-group">
        <input type="password" v-model="password" placeholder="비밀번호 입력" />
      </div>

      <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>

      <div class="button-group">
        <button type="button" class="btn-cancel" @click="router.back()">취소</button>
        <button type="button" class="btn-danger" :disabled="isLoading || !password" @click="handleWithdraw">
          {{ isLoading ? '처리 중...' : '탈퇴하기' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.withdraw-container { max-width: 480px; margin: 60px auto; padding: 0 20px; }
.page-title { font-size: 28px; font-weight: 800; color: #2B2119; margin-bottom: 24px; }
.withdraw-card { background: #FFFFFF; border-radius: 20px; padding: 32px; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.04); }

.warning-text { font-size: 15px; color: #6F6151; margin-bottom: 20px; font-weight: 500; }
.input-group input { width: 100%; font-size: 16px; padding: 14px 16px; font-weight: 600; color: #374151; background-color: #F9FAFB; border: none; border-radius: 12px; outline: none; box-sizing: border-box; }
.input-group input:focus { background-color: #F3F4F6; }

.error-msg { font-size: 13px; color: #D5402A; margin-top: 12px; }

.button-group { display: flex; gap: 12px; margin-top: 32px; }
button { flex: 1; padding: 14px; border-radius: 12px; font-size: 15px; font-weight: 700; border: none; cursor: pointer; }
.btn-cancel { background-color: #F3F4F6; color: #6B7280; }
.btn-danger { background-color: #FEF2F2; color: #D5402A; transition: background-color 0.2s; }
.btn-danger:hover:not(:disabled) { background-color: #FEE2E2; }
.btn-danger:disabled { opacity: 0.5; cursor: not-allowed; }
</style>