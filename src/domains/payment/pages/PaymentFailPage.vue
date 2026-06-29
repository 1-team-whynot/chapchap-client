<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseButton from '../../common/components/BaseButton.vue'

const route = useRoute()
const router = useRouter()

const errorCode = computed(() => String(route.query.code || 'UNKNOWN_ERROR'))

const errorMessage = computed(() => {
  return String(route.query.message || '결제 진행 중 알 수 없는 오류가 발생했습니다.')
})

const orderId = computed(() => String(route.query.orderId || 'N/A'))
const reservationId = computed(() => String(route.query.reservationId || ''))
const paymentType = computed(() => String(route.query.type || 'deposit'))

function retryPayment() {
  if (reservationId.value) {
    router.push({
      path: '/payment',
      query: {
        id: reservationId.value,
        type: paymentType.value,
      },
    })
    return
  }

  router.push('/payment')
}

function goBack() {
  // 내 예약 페이지가 아직 없으므로 임시로 결제 페이지로 이동
  router.push('/payment')
}
</script>

<template>
  <div class="page">
    <main class="page-body--center">
      <div class="fail-screen container container--xs">
        <span class="fail-screen-icon">❌</span>

        <h1 class="fail-screen-title">결제에 실패하였습니다</h1>

        <p class="fail-screen-desc">
          결제 과정에서 오류가 발생했거나 사용자가 결제를 중단하였습니다.
        </p>

        <div class="card error-info-card mb-6">
          <div class="info-row">
            <span class="info-label">에러 코드</span>
            <span class="info-value error-code">{{ errorCode }}</span>
          </div>

          <div class="info-row">
            <span class="info-label">실패 사유</span>
            <span class="info-value">{{ errorMessage }}</span>
          </div>

          <div class="info-row">
            <span class="info-label">주문 번호</span>
            <span class="info-value">{{ orderId }}</span>
          </div>

          <div class="info-row">
            <span class="info-label">예약 번호</span>
            <span class="info-value">{{ reservationId || '-' }}</span>
          </div>
        </div>

        <div class="fail-actions">
          <BaseButton variant="ghost" full-width @click="goBack">
            이전으로
          </BaseButton>

          <BaseButton variant="primary" full-width @click="retryPayment">
            다시 결제 시도
          </BaseButton>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.fail-screen {
  text-align: center;
  padding: 40px var(--space-4);
}

.fail-screen-icon {
  font-size: 64px;
  display: block;
  margin-bottom: var(--space-4);
  animation: checkPop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
}

.fail-screen-title {
  font-size: 28px;
  font-weight: 800;
  color: var(--color-text);
  margin-bottom: var(--space-2);
}

.fail-screen-desc {
  font-size: var(--text-base);
  color: var(--color-text-sub);
  line-height: 1.6;
  margin-bottom: var(--space-6);
}

.error-info-card {
  text-align: left;
  padding: 24px;
  border-color: var(--color-danger-border);
  background-color: var(--color-danger-light);
}

.info-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 12px;
  font-size: var(--text-sm);
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-label {
  color: var(--color-text-sub);
  font-weight: 500;
  flex-shrink: 0;
}

.info-value {
  font-weight: 700;
  color: var(--color-text);
  text-align: right;
  word-break: break-all;
  max-width: 70%;
}

.error-code {
  color: var(--color-danger);
}

.fail-actions {
  display: flex;
  gap: var(--space-3);
}

@media (max-width: 640px) {
  .fail-actions {
    flex-direction: column;
  }
}
</style>