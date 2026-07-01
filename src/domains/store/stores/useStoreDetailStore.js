import { defineStore } from 'pinia'
import { ref } from 'vue'

import myAxios from '../../api/myAxios.js'

export const useStoreDetailStore = defineStore('storeDetailStore', () => {
  const store = ref(null)
  const isLoading = ref(false)
  const errorMessage = ref('')

  const fetchStoreDetail = async (storeId) => {
    if (!storeId) {
      store.value = null
      errorMessage.value = '업체 정보를 찾을 수 없습니다.'
      return
    }

    isLoading.value = true
    errorMessage.value = ''

    try {
      const response = await myAxios.get(`/api/stores/${storeId}`)
      store.value = response.data?.data ?? null

      if (!store.value) {
        errorMessage.value = '업체 정보를 찾을 수 없습니다.'
      }
    } catch (error) {
      console.error(error)
      store.value = null
      errorMessage.value = '업체 상세 정보를 불러오지 못했습니다.'
    } finally {
      isLoading.value = false
    }
  }

  const resetState = () => {
    store.value = null
    isLoading.value = false
    errorMessage.value = ''
  }

  return {
    store,
    isLoading,
    errorMessage,
    fetchStoreDetail,
    resetState,
  }
})
