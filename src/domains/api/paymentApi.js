import myAxios from './myAxios'

export const readyPayment = ({ reservationId, paymentType }) => {
  return myAxios.post('/api/payments/ready', {
    reservationId,
    paymentType,
  })
}

export const confirmPayment = ({ paymentKey, orderId, amount }) => {
  return myAxios.post('/api/payments/confirm', {
    paymentKey,
    orderId,
    amount,
  })
}

// 더미 결제 confirm을 따로 쓸 경우
export const mockConfirmPayment = ({ orderId, amount }) => {
  return myAxios.post('/api/payments/mock/confirm', {
    orderId,
    amount,
  })
}