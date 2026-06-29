<script setup>
import { computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useChecklistStore } from '../../checklist/stores/useChecklistStore.js'
import StoreCard from '../components/StoreCard.vue'
import { useStoreListStore } from '../stores/useStoreListStore.js'

const route = useRoute()
const router = useRouter()
const checklistStore = useChecklistStore()
const storeListStore = useStoreListStore()

const toArray = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean)
  if (value) return [value]
  return []
}

const hasFilterQuery = computed(() => (
  Boolean(route.query.regionId)
  || Boolean(route.query.eventStartDate)
  || Boolean(route.query.eventEndDate)
  || Boolean(route.query.minHeadcount)
  || Boolean(route.query.maxHeadcount)
  || toArray(route.query.selectedCategories).length > 0
  || route.query.isPowerAvailable !== undefined
))

const isFilterQueryComplete = computed(() => (
  Boolean(route.query.regionId)
  && Boolean(route.query.eventStartDate)
  && Boolean(route.query.eventEndDate)
  && Boolean(route.query.minHeadcount)
  && Boolean(route.query.maxHeadcount)
  && toArray(route.query.selectedCategories).length > 0
  && route.query.isPowerAvailable !== undefined
))

const filterCondition = computed(() => ({
  regionId: route.query.regionId,
  regionDetail: route.query.regionDetail || '',
  eventStartDate: route.query.eventStartDate,
  eventEndDate: route.query.eventEndDate,
  minHeadcount: route.query.minHeadcount,
  maxHeadcount: route.query.maxHeadcount,
  selectedCategories: toArray(route.query.selectedCategories),
  isPowerAvailable: route.query.isPowerAvailable === 'true',
}))

const pageTitle = computed(() => (
  storeListStore.mode === 'filtered' ? '조건에 맞는 업체 목록' : '전체 업체 목록'
))

const emptyTitle = computed(() => (
  storeListStore.mode === 'filtered'
    ? '조건에 맞는 업체가 없습니다.'
    : '등록된 업체가 없습니다.'
))

const filterChips = computed(() => {
  if (storeListStore.mode !== 'filtered') return []

  const region = checklistStore.getRegionLabel(filterCondition.value.regionId)
  const categories = filterCondition.value.selectedCategories
  const headcount = checklistStore.getHeadcountLabelByRange(
    filterCondition.value.minHeadcount,
    filterCondition.value.maxHeadcount,
  )

  return [
    region,
    `${filterCondition.value.eventStartDate} ~ ${filterCondition.value.eventEndDate}`,
    headcount,
    ...categories,
    filterCondition.value.isPowerAvailable ? '전기 사용 가능' : '전기 사용 불가',
  ].filter(Boolean)
})

const loadStores = async () => {
  if (hasFilterQuery.value && !isFilterQueryComplete.value) {
    storeListStore.resetState()
    storeListStore.errorMessage = '체크리스트 조건을 모두 입력해 주세요.'
    return
  }

  if (isFilterQueryComplete.value) {
    await storeListStore.fetchMatchingStores(filterCondition.value)
    return
  }

  await storeListStore.fetchAllStores()
}

onMounted(loadStores)

watch(
  () => route.fullPath,
  () => {
    loadStores()
  },
)
</script>

<template>
  <main class="page-body">
    <div class="container container--lg store-list-page">
      <header class="page-header">
        <div>
          <h1 class="page-header-title">{{ pageTitle }}</h1>
          <p class="page-header-desc">
            행사 조건에 맞는 밥차와 푸드트럭 업체를 확인해보세요.
          </p>
        </div>

        <button
          class="condition-button"
          type="button"
          @click="router.push('/checklist')"
        >
          조건 입력
        </button>
      </header>

      <div v-if="filterChips.length > 0" class="filter-chips">
        <span
          v-for="chip in filterChips"
          :key="chip"
          class="chip"
        >
          {{ chip }}
        </span>
      </div>

      <section v-if="storeListStore.isLoading" class="store-state-message">
        업체 목록을 불러오는 중입니다.
      </section>

      <section v-else-if="storeListStore.errorMessage" class="store-state-message">
        {{ storeListStore.errorMessage }}
      </section>

      <section v-else-if="storeListStore.stores.length === 0" class="store-state-message">
        <strong>{{ emptyTitle }}</strong>
        <span>조건을 변경해보세요.</span>
      </section>

      <section v-else class="store-grid">
        <StoreCard
          v-for="store in storeListStore.stores"
          :key="store.storeId"
          :store="store"
        />
      </section>

      <nav
        v-if="storeListStore.pageRange.length > 0"
        class="pagination"
        aria-label="업체 목록 페이지"
      >
        <button
          type="button"
          :disabled="storeListStore.currentPage === 1 || storeListStore.isLoading"
          @click="storeListStore.changePage(storeListStore.currentPage - 1, filterCondition)"
        >
          이전
        </button>

        <button
          v-for="page in storeListStore.pageRange"
          :key="page"
          type="button"
          :class="{ active: storeListStore.currentPage === page }"
          :disabled="storeListStore.isLoading"
          @click="storeListStore.changePage(page, filterCondition)"
        >
          {{ page }}
        </button>

        <button
          type="button"
          :disabled="storeListStore.isLastPage || storeListStore.isLoading"
          @click="storeListStore.changePage(storeListStore.currentPage + 1, filterCondition)"
        >
          다음
        </button>
      </nav>
    </div>
  </main>
</template>

<style scoped>
.store-list-page {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);
  margin-bottom: 0;
}

.condition-button {
  flex-shrink: 0;
  padding: 11px 18px;
  border: 1.5px solid var(--color-primary);
  border-radius: var(--radius-lg);
  background: var(--color-white);
  color: var(--color-primary);
  font-weight: 800;
}

.filter-chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.chip {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border: 1px solid #fed7aa;
  border-radius: var(--radius-full);
  background: #fff7ed;
  color: var(--color-primary);
  font-size: var(--text-sm);
  font-weight: 800;
}

.store-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-5);
}

.store-state-message {
  display: flex;
  min-height: 220px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-8);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-xl);
  background: var(--color-white);
  color: var(--color-text-muted);
  font-size: var(--text-md);
  font-weight: 700;
  text-align: center;
}

.store-state-message strong {
  color: var(--color-text);
  font-size: var(--text-lg);
}

.pagination {
  display: flex;
  justify-content: center;
  gap: var(--space-2);
}

.pagination button {
  min-width: 40px;
  padding: 9px 12px;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-white);
  color: var(--color-text-sub);
  font-weight: 800;
}

.pagination button.active {
  border-color: var(--color-primary);
  background: var(--color-primary);
  color: var(--color-white);
}

.pagination button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

@media (max-width: 1024px) {
  .store-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .page-header {
    flex-direction: column;
  }

  .condition-button {
    width: 100%;
  }

  .store-grid {
    grid-template-columns: 1fr;
  }
}
</style>
