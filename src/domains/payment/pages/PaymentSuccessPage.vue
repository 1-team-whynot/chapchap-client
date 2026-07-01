<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { confirmPayment } from '../../api/paymentApi.js'

const route = useRoute()
const router = useRouter()

const isLoading = ref(true)
const errorMessage = ref('')

onMounted(async () => {
  const paymentKey = String(route.query.paymentKey || '')
  const orderId = String(route.query.orderId || '')
  const amount = Number(route.query.amount)

  const reservationId = String(route.query.reservationId || '')
  const paymentType = String(route.query.type || 'deposit')

  if (!paymentKey || !orderId || !Number.isFinite(amount) || amount <= 0) {
    router.replace({
      path: '/payment/fail',
      query: {
        code: 'INVALID_PAYMENT_QUERY',
        message: '결제 승인 정보가 부족합니다.',
        orderId,
        reservationId,
        type: paymentType,
      },
    })
    return
  }

  try {
    await confirmPayment({
      paymentKey,
      orderId,
      amount,
    })

    router.replace({
      path: '/payment/complete',
      query: {
        orderId,
        amount,
        reservationId,
        type: paymentType,
      },
    })
  } catch (error) {
    console.error('결제 승인 실패:', error)

    const code = error.response?.data?.code || 'CONFIRM_FAILED'
    const message =
      error.response?.data?.data ||
      error.response?.data?.message ||
      '결제 승인 중 오류가 발생했습니다.'

    errorMessage.value = message

    router.replace({
      path: '/payment/fail',
      query: {
        code,
        message,
        orderId,
        reservationId,
        type: paymentType,
      },
    })
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="page">
    <main class="page-body--center">
      <div class="payment-confirm-screen container container--xs">
        <div class="card confirm-card">
          <span class="confirm-icon">⏳</span>

          <h1 class="confirm-title">결제 승인 처리 중</h1>

          <p v-if="isLoading" class="confirm-desc">
            결제 정보를 확인하고 있습니다. 잠시만 기다려 주세요.
          </p>

          <p v-else class="confirm-desc">
            {{ errorMessage || '결제 승인 결과를 확인하고 있습니다.' }}
          </p>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.payment-confirm-screen {
  text-align: center;
  padding: 40px var(--space-4);
}

.confirm-card {
  padding: 40px 24px;
}

.confirm-icon {
  display: block;
  font-size: 48px;
  margin-bottom: var(--space-4);
}

.confirm-title {
  font-size: 24px;
  font-weight: 800;
  color: var(--color-text);
  margin-bottom: var(--space-3);
}

.confirm-desc {
  font-size: var(--text-base);
  color: var(--color-text-sub);
  line-height: 1.6;
}
</style>