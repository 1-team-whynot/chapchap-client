import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import myAxios from '../../api/myAxios.js'

export const useMyRequestsStore = defineStore('myRequestsStore', () => {
  const reservations = ref([])
  const totalCount = ref(0)
  const currentPage = ref(1)
  const limit = ref(10)
  const activeStatus = ref('')
  const message = ref('')
  const isLoading = ref(false)
  const errorMessage = ref('')

  const totalPages = computed(() => Math.ceil(totalCount.value / limit.value))

  const pageRange = computed(() => {
    const pages = []
    for (let page = 1; page <= totalPages.value; page += 1) {
      pages.push(page)
    }
    return pages
  })

  const fetchMyRequests = async (page = 1, status = activeStatus.value) => {
    isLoading.value = true
    errorMessage.value = ''
    activeStatus.value = status

    try {
      const params = {
        page,
        limit: limit.value,
      }

      if (status) {
        params.status = status
      }

      const response = await myAxios.get('/api/reservations/my', {
        params,
      })
      const data = response.data?.data ?? {}

      reservations.value = Array.isArray(data.reservations) ? data.reservations : []
      totalCount.value = Number(data.totalCount ?? 0)
      currentPage.value = Number(data.page ?? page)
      limit.value = Number(data.limit ?? limit.value)
      message.value = data.message ?? ''
    } catch (error) {
      console.error(error)
      reservations.value = []
      totalCount.value = 0
      message.value = ''
      errorMessage.value =
        error.response?.data?.data ||
        error.response?.data?.message ||
        '내 요청 목록을 불러오지 못했습니다.'
    } finally {
      isLoading.value = false
    }
  }

  const changePage = async (page) => {
    if (page < 1) return
    if (totalPages.value > 0 && page > totalPages.value) return
    if (page === currentPage.value) return

    await fetchMyRequests(page, activeStatus.value)
  }

  const changeStatus = async (status) => {
    if (status === activeStatus.value) return

    await fetchMyRequests(1, status)
  }

  return {
    reservations,
    totalCount,
    currentPage,
    limit,
    activeStatus,
    message,
    isLoading,
    errorMessage,
    totalPages,
    pageRange,
    fetchMyRequests,
    changePage,
    changeStatus,
  }
})
