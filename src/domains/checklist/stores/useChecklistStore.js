import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const toDateInputValue = (date) => {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  return localDate.toISOString().slice(0, 10)
}

const createMinEventDate = () => {
  const date = new Date()
  date.setDate(date.getDate() + 14)
  return toDateInputValue(date)
}

export const useChecklistStore = defineStore('checklist', () => {
  const REGIONS = [
    { value: 1, label: '서울' },
    { value: 2, label: '부산' },
    { value: 3, label: '대구' },
    { value: 4, label: '인천' },
    { value: 5, label: '광주' },
    { value: 6, label: '대전' },
    { value: 7, label: '울산' },
    { value: 8, label: '세종' },
    { value: 9, label: '경기' },
    { value: 10, label: '제주' },
  ]

  const HEADCOUNT_OPTIONS = [
    { label: '30명 이하', value: 'under-30', min: 30, max: 30 },
    { label: '31~100명', value: '31-100', min: 100, max: 100 },
    { label: '101~200명', value: '101-200', min: 200, max: 200 },
    { label: '201~300명', value: '201-300', min: 300, max: 300 },
    { label: '300명 초과', value: 'over-300', min: 301, max: 301 },
  ]

  const MENU_CATEGORIES = [
    '분식',
    '한식',
    '일식',
    '중식',
    '양식',
    '카페/디저트',
    '패스트푸드',
    '기타',
  ]

  const minEventDate = createMinEventDate()

  const regionId = ref('')
  const regionDetail = ref('')
  const eventStartDate = ref('')
  const eventEndDate = ref('')
  const headcount = ref('')
  const selectedCategories = ref([])
  const isPowerAvailable = ref(null)

  const selectedHeadcount = computed(() => (
    HEADCOUNT_OPTIONS.find((option) => option.value === headcount.value) ?? null
  ))

  const isStartDateValid = computed(() => (
    Boolean(eventStartDate.value) && eventStartDate.value >= minEventDate
  ))

  const isDateRangeValid = computed(() => (
    isStartDateValid.value
    && Boolean(eventEndDate.value)
    && eventEndDate.value >= eventStartDate.value
  ))

  const dateMessage = computed(() => {
    if (eventStartDate.value && eventStartDate.value < minEventDate) {
      return '행사 시작 일자는 오늘 기준 14일 이후부터 선택할 수 있습니다.'
    }

    if (
      eventStartDate.value
      && eventEndDate.value
      && eventEndDate.value < eventStartDate.value
    ) {
      return '행사 종료 일자는 시작 일자보다 빠를 수 없습니다.'
    }

    return ''
  })

  const isComplete = computed(() => (
    Boolean(regionId.value)
    && isDateRangeValid.value
    && Boolean(selectedHeadcount.value)
    && selectedCategories.value.length > 0
    && isPowerAvailable.value !== null
  ))

  const filterParams = computed(() => {
    if (!selectedHeadcount.value) return {}

    return {
      regionId: regionId.value,
      regionDetail: regionDetail.value,
      eventStartDate: eventStartDate.value,
      eventEndDate: eventEndDate.value,
      minHeadcount: selectedHeadcount.value.min,
      maxHeadcount: selectedHeadcount.value.max,
      selectedCategories: [...selectedCategories.value],
      isPowerAvailable: isPowerAvailable.value,
    }
  })

  const toggleCategory = (category) => {
    const index = selectedCategories.value.indexOf(category)

    if (index === -1) {
      selectedCategories.value.push(category)
      return
    }

    selectedCategories.value.splice(index, 1)
  }

  const getRegionLabel = (value) => (
    REGIONS.find((region) => String(region.value) === String(value))?.label ?? ''
  )

  const getHeadcountLabel = (value) => (
    HEADCOUNT_OPTIONS.find((option) => option.value === value)?.label ?? ''
  )

  const getHeadcountLabelByRange = (minHeadcount, maxHeadcount) => (
    HEADCOUNT_OPTIONS.find((option) => (
      String(option.min) === String(minHeadcount)
      && String(option.max) === String(maxHeadcount)
    ))?.label ?? ''
  )

  return {
    REGIONS,
    HEADCOUNT_OPTIONS,
    MENU_CATEGORIES,
    minEventDate,
    regionId,
    regionDetail,
    eventStartDate,
    eventEndDate,
    headcount,
    selectedCategories,
    isPowerAvailable,
    selectedHeadcount,
    isDateRangeValid,
    dateMessage,
    isComplete,
    filterParams,
    toggleCategory,
    getRegionLabel,
    getHeadcountLabel,
    getHeadcountLabelByRange,
  }
})
