import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useReservationDraftStore = defineStore('reservationDraftStore', () => {
  const store = ref(null)
  const selectedMenus = ref([])

  const selectedMenuIds = computed(() => selectedMenus.value.map((menu) => menu.menuId))
  const hasDraft = computed(() => Boolean(store.value?.storeId) && selectedMenuIds.value.length > 0)

  const setDraft = ({ store: nextStore, selectedMenus: nextSelectedMenus }) => {
    store.value = nextStore
    selectedMenus.value = Array.isArray(nextSelectedMenus) ? nextSelectedMenus : []
  }

  const clearDraft = () => {
    store.value = null
    selectedMenus.value = []
  }

  return {
    store,
    selectedMenus,
    selectedMenuIds,
    hasDraft,
    setDraft,
    clearDraft,
  }
})
