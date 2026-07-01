<script setup>
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../../../stores/user/useUserStore.js';

// 공통 컴포넌트
import BaseInput from '../../common/components/BaseInput.vue';
import BaseButton from '../../common/components/BaseButton.vue';

import updateInfoValidator from '../util/updateInfoValidator.js';

const router = useRouter()
const userStore = useUserStore()

const isLoading = ref(false)

// 사용자가 입력할 폼 데이터
const updateForm = reactive({
  name: '',
  phone: ''
})

// 에러 메시지 상태 관리
const errors = reactive({
  name: '',
  phone: ''
})

// 화면이 켜질 때 기존 데이터를 폼에 미리 채워줍니다.
onMounted(async () => {
  // 스토어에 내 정보가 없으면 새로 불러옵니다.
  if (!userStore.myInfo) {
    await userStore.selectInfo()
  }
  
  updateForm.name = userStore.myInfo?.name || ''
  updateForm.phone = userStore.myInfo?.phone || ''
})

// 저장 버튼 클릭 시 실행되는 함수
const handleSubmit = async () => {
  // 1. 유효성 검사 (정규식 체크)
  errors.name = updateInfoValidator.name(updateForm.name);
  errors.phone = updateInfoValidator.phone(updateForm.phone);

  // 에러가 하나라도 있으면 서버로 보내지 않고 중단
  if (errors.name || errors.phone) return

  // 2. DB 서버로 데이터 전송 (Pinia Store 액션 호출)
  try {
    isLoading.value = true
    
    // 스토어의 updateInfo가 myAxios.put('/api/users/info-update', updateForm)을 실행합니다.
    await userStore.updateInfo({
      name: updateForm.name,
      phone: updateForm.phone
    })
    
    alert('내 정보가 성공적으로 수정되었습니다. ✨')
    
    // 수정 완료 후 이전 화면(내 정보 조회)으로 돌아갑니다.
    router.replace('/users/info')
    
  } catch (error) {
    // 백엔드의 @Valid 검증(E10 에러) 등 예외 처리
    const code = error.response?.data?.code
    if (code === 'E10') {
      alert('입력 양식이 올바르지 않습니다. 다시 확인해주세요.')
    } else if (code === 'E30') {
      alert('이미 가입된 번호입니다.')
    } else {
      alert('정보 수정 중 서버 오류가 발생했습니다.')
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="update-wrapper">
    <div class="update-container">
      
      <header class="page-header">
        <h2 class="page-title">정보 변경 📝</h2>
        <p class="page-subtitle">변경할 이름과 연락처를 입력해 주세요.</p>
      </header>

      <form @submit.prevent="handleSubmit" class="update-card">
        
        <div class="input-list">
          <BaseInput
            label="이름"
            placeholder="공백 없이 2~40자"
            v-model="updateForm.name"
            :error="errors.name"
          />

          <BaseInput
            label="연락처"
            type="tel"
            placeholder="- 제외 숫자 11자리 입력"
            v-model="updateForm.phone"
            :error="errors.phone"
          />
        </div>

        <div class="button-group">
          <BaseButton 
            variant="ghost" 
            type="button"
            @click="router.back()"
          >
            취소
          </BaseButton>

          <BaseButton 
            variant="primary" 
            type="submit"
            :disabled="isLoading"
          >
            {{ isLoading ? '저장 중...' : '저장하기' }}
          </BaseButton>
        </div>

      </form>
    </div>
  </div>
</template>

<style scoped>
/* 이전 마이페이지와 동일한 트렌디한 디자인 구조 */
.update-wrapper {
  min-height: 100vh;
  background-color: var(--color-bg);
  padding: var(--space-16) var(--space-5);
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.update-container {
  width: 100%;
  max-width: var(--w-xs); /* 480px */
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

.update-card {
  background: var(--color-white);
  border-radius: var(--radius-2xl);
  padding: var(--space-10) var(--space-8);
  box-shadow: var(--shadow-lg);
}

.input-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  margin-bottom: var(--space-10);
}

.button-group {
  display: flex;
  gap: var(--space-3);
}

.button-group > * {
  flex: 1; /* 버튼 두 개가 정확히 1:1 비율로 꽉 차게 됨 */
}
</style>