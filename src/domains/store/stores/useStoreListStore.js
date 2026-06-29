import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import myAxios from '../../api/myAxios.js'

const serializeParams = (params) => {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return

    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item !== undefined && item !== null && item !== '') {
          searchParams.append(key, item)
        }
      })
      return
    }

    searchParams.append(key, value)
  })

  return searchParams.toString()
}

export const useStoreListStore = defineStore('storeListStore', () => {
  const stores = ref([])
  const isLastPage = ref(false)
  const totalItems = ref(0)
  const currentPage = ref(1)
  const isLoading = ref(false)
  const errorMessage = ref('')
  const mode = ref('all')

  const limit = 6
  const paginationBtnLimit = 5

  const totalPages = computed(() => Math.ceil(totalItems.value / limit))

  const pageRange = computed(() => {
    const total = totalPages.value
    if (total === 0) return []

    const current = currentPage.value
    const count = paginationBtnLimit
    let start = current - Math.floor(count / 2)

    if (start < 1) start = 1

    let end = start + count - 1
    if (end > total) {
      end = total
      start = Math.max(1, end - count + 1)
    }

    const pages = []
    for (let page = start; page <= end; page += 1) {
      pages.push(page)
    }

    return pages
  })

  const setListResponse = (data) => {
    stores.value = Array.isArray(data?.stores) ? data.stores : []
    totalItems.value = Number(data?.totalItems ?? 0)
    isLastPage.value = Boolean(data?.isLastPage)
  }

  const fetchStoreList = async ({ nextMode, page, condition = {} }) => {
    isLoading.value = true
    errorMessage.value = ''
    mode.value = nextMode
    currentPage.value = page

    const url = nextMode === 'filtered' ? '/api/stores' : '/api/allStores'
    const params = {
      ...(nextMode === 'filtered' ? condition : {}),
      page,
      limit,
    }

    try {
      const response = await myAxios.get(url, {
        params,
        paramsSerializer: { serialize: serializeParams },
      })

      setListResponse(response.data?.data)
    } catch (error) {
      console.error(error)
      stores.value = []
      totalItems.value = 0
      isLastPage.value = true
      errorMessage.value = '업체 목록을 불러오지 못했습니다.'
    } finally {
      isLoading.value = false
    }
  }

  const fetchAllStores = (page = 1) => (
    fetchStoreList({ nextMode: 'all', page })
  )

  const fetchMatchingStores = (condition, page = 1) => (
    fetchStoreList({ nextMode: 'filtered', page, condition })
  )

  const changePage = async (page, condition = null) => {
    if (page < 1) return
    if (totalPages.value > 0 && page > totalPages.value) return

    if (mode.value === 'filtered') {
      await fetchMatchingStores(condition, page)
      return
    }

    await fetchAllStores(page)
  }

  const resetState = () => {
    stores.value = []
    isLastPage.value = false
    totalItems.value = 0
    currentPage.value = 1
    isLoading.value = false
    errorMessage.value = ''
    mode.value = 'all'
  }

  return {
    stores,
    isLastPage,
    totalItems,
    currentPage,
    isLoading,
    errorMessage,
    mode,
    limit,
    totalPages,
    pageRange,
    fetchAllStores,
    fetchMatchingStores,
    changePage,
    resetState,
  }
})
