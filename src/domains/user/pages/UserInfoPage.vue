<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../../stores/user/useUserStore.js'

import BaseInput from '../../../domains/common/components/BaseInput.vue'
import BaseButton from '../../../domains/common/components/BaseButton.vue'

const router = useRouter()
const userStore = useUserStore()
const isLoading = ref(true)

onMounted(async () => {
  try {
    await userStore.selectInfo()
  } catch (error) {
    console.error('사용자 정보를 불러오지 못했습니다.', error)
  } finally {
    isLoading.value = false
  }
})

// 연락처 포맷팅 (01012345678 -> 010-1234-5678)
const formatPhone = (phone) => {
  if (!phone) return ''
  return phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
}
</script>

<template>
  <div class="mypage-wrapper">
    <div class="mypage-container">
      
      <header class="page-header">
        <h2 class="page-title">내 정보 관리 🛠️</h2>
        <p class="page-subtitle">상다리에 등록된 소중한 내 정보를 확인하세요.</p>
      </header>

      <div v-if="isLoading" class="loading-state">
        <span class="spinner"></span>
        <p>정보를 불러오는 중입니다...</p>
      </div>

      <div v-else class="info-card">
        <div class="box-container">
          <div class="box">
            {{ userStore.myInfo?.name ?? '사용자' }}
          </div>
        </div>
        <div class="info-list">
          <BaseInput
            label="이메일 계정"
            :modelValue="userStore.myInfo?.email"
            readonly
          />

          <BaseInput
            label="이름"
            :modelValue="userStore.myInfo?.name"
            readonly
          />

          <BaseInput
            label="연락처"
            :modelValue="formatPhone(userStore.myInfo?.phone)"
            readonly
          />
        </div>

        <div class="action-buttons">
          <BaseButton 
            variant="primary" 
            fullWidth 
            @click="router.push('/users/info-update')"
          >
            정보 변경
          </BaseButton>
          
          <BaseButton 
            variant="outline" 
            fullWidth 
            @click="router.push('/users/password-change')"
          >
            비밀번호 변경
          </BaseButton>
        </div>

        <!-- 위험 구역 -->
        <div class="card danger-zone">
          <h2 class="card__label text-danger mb-3">위험 구역</h2>
          <p class="text-muted text-base mb-4">계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다.</p>
          <BaseButton variant="danger" @click="router.push('/users/withdraw')">
            계정 삭제
          </BaseButton>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
/* 공통 컴포넌트(BaseInput, BaseButton)가 자체적인 스타일을 
  모두 가지고 있으므로, 여기서는 레이아웃(배치)에 관련된 CSS만 남깁니다. 
*/

.mypage-wrapper {
  min-height: 100vh;
  background-color: var(--color-bg);
  padding: var(--space-16) var(--space-5);
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.mypage-container {
  width: 100%;
  max-width: var(--w-xs);
}

.page-header {
  margin-bottom: var(--space-8);
}

.page-title {
  font-size: var(--text-3xl);
  font-weight: 800;
  color: var(--color-text);
  margin-bottom: var(--space-2);
}

.page-subtitle {
  font-size: var(--text-md);
  color: var(--color-text-placeholder);
  font-weight: 500;
}

.info-card {
  background: var(--color-white);
  border-radius: var(--radius-2xl);
  padding: var(--space-10) var(--space-8);
  box-shadow: var(--shadow-lg);
}

/* BaseInput들 사이의 간격 조정 */
.info-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  margin-bottom: var(--space-8);
}

/* 버튼들 사이의 간격 및 배치 */
.action-buttons {
  display: flex;
  gap: var(--space-3);
  margin-top: var(--space-6);
}

.footer-action {
  margin-top: var(--space-6);
  display: flex;
  justify-content: center;
}

.danger-zone {
  margin-top: 30px;
}

.box-container {
  padding: 20px 0 80px;
  display: flex;
  justify-content: center;
}

.box {
  width: 150px;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 900;
  font-size: 1.5rem;
  color: var(--color-white);
  border-radius: 100%;
  background-color: var(--color-primary);
}

/* 로딩 애니메이션 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-16) 0;
  color: var(--color-text-placeholder);
  font-weight: 600;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 4px solid var(--color-bg-alt);
  border-top-color: var(--color-primary);
  border-radius: var(--radius-full);
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>