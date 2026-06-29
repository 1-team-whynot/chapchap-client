import { defineStore } from 'pinia'
import { ref } from 'vue'

import myAxios from '../../api/myAxios.js'

export const useReservationCreateStore = defineStore('reservationCreateStore', () => {
  const createdReservation = ref(null)
  const isLoading = ref(false)
  const errorMessage = ref('')

  const createReservation = async (payload) => {
    isLoading.value = true
    errorMessage.value = ''

    try {
      const response = await myAxios.post('/api/reservations', payload)
      createdReservation.value = response.data?.data ?? null
      return createdReservation.value
    } catch (error) {
      console.error(error)
      errorMessage.value =
        error.response?.data?.data ||
        error.response?.data?.message ||
        '견적 요청을 전송하지 못했습니다.'
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const resetState = () => {
    createdReservation.value = null
    isLoading.value = false
    errorMessage.value = ''
  }

  return {
    createdReservation,
    isLoading,
    errorMessage,
    createReservation,
    resetState,
  }
})
