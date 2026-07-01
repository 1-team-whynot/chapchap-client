<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseButton from '../../common/components/BaseButton.vue'

const route = useRoute()
const router = useRouter()

const orderId = computed(() => String(route.query.orderId || ''))
const amount = computed(() => Number(route.query.amount || 0))
const reservationId = computed(() => String(route.query.reservationId || ''))
const paymentType = computed(() => String(route.query.type || 'deposit'))

const paymentTypeName = computed(() => {
  return paymentType.value === 'balance' ? '잔금' : '계약금'
})

const statusText = computed(() => {
  return paymentType.value === 'balance' ? '결제 완료' : '예약 확정'
})

const statusBadgeClass = computed(() => {
  return paymentType.value === 'balance'
    ? 'status-badge--PAYMENT_COMPLETED'
    : 'status-badge--CONFIRMED'
})

const goReservation = () => {
  router.push('/my-requests')
}

const goNewRequest = () => {
  router.push('/storelist')
}
</script>

<template>
  <div class="page">
    <main class="page-body--center">
      <div class="success-screen container container--xs">
        <span class="success-screen-icon">🎉</span>

        <h1 class="success-screen-title">결제가 완료되었습니다!</h1>

        <p class="success-screen-desc">
          백엔드 결제 승인 및 저장 처리가 완료되었습니다.
        </p>

        <div class="card payment-info-card mb-6">
          <div class="confirmed-card-status mb-4">
            <span :class="['status-badge', statusBadgeClass]">
              {{ statusText }}
            </span>

            <span class="text-sm text-muted">
              {{ paymentTypeName }} 결제 완료
            </span>
          </div>

          <div class="info-row">
            <span class="info-label">예약 번호</span>
            <span class="info-value">{{ reservationId || '-' }}</span>
          </div>

          <div class="info-row">
            <span class="info-label">결제 금액</span>
            <span class="info-value amount-value">
              {{ amount.toLocaleString() }}원
            </span>
          </div>

          <div class="info-row">
            <span class="info-label">주문 번호</span>
            <span class="info-value">{{ orderId || '-' }}</span>
          </div>
        </div>

        <div class="alert alert--info mb-6 text-left">
          💡 <b>안내:</b> 결제 승인 처리가 완료되었습니다.
          예약 상태는 백엔드 결제 처리 결과를 기준으로 반영됩니다.
        </div>

        <div class="confirmed-actions">
          <BaseButton variant="ghost" full-width @click="goReservation">
            내 예약 보기
          </BaseButton>

          <BaseButton variant="primary" full-width @click="goNewRequest">
            새 견적 요청
          </BaseButton>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.success-screen {
  text-align: center;
  padding: 40px var(--space-4);
}

.success-screen-icon {
  font-size: 64px;
  display: block;
  margin-bottom: var(--space-4);
  animation: checkPop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
}

.success-screen-title {
  font-size: 28px;
  font-weight: 800;
  color: var(--color-text);
  margin-bottom: var(--space-2);
}

.success-screen-desc {
  font-size: var(--text-base);
  color: var(--color-text-sub);
  line-height: 1.6;
  margin-bottom: var(--space-6);
}

.payment-info-card {
  text-align: left;
  padding: 24px;
}

.confirmed-card-status {
  display: flex;
  align-items: center;
  gap: 10px;
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
  padding-top: 12px;
  border-top: 1px dashed var(--color-border);
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
}

.amount-value {
  color: var(--color-primary);
  font-size: var(--text-md);
}

.text-left {
  text-align: left;
}

.confirmed-actions {
  display: flex;
  gap: var(--space-3);
}

@media (max-width: 640px) {
  .confirmed-actions {
    flex-direction: column;
  }
}
</style>
