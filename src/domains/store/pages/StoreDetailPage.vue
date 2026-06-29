<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import BaseButton from '../../common/components/BaseButton.vue'
import { useReservationDraftStore } from '../../reservation/stores/useReservationDraftStore.js'
import { resolveFileUrl } from '../../../utils/resolveFileUrl.js'
import { useStoreDetailStore } from '../stores/useStoreDetailStore.js'

const route = useRoute()
const router = useRouter()
const storeDetailStore = useStoreDetailStore()
const reservationDraftStore = useReservationDraftStore()

const selectedMenuIds = ref([])

const storeId = computed(() => route.params.storeId)
const store = computed(() => storeDetailStore.store)
const menus = computed(() => (
  Array.isArray(store.value?.menus) ? store.value.menus : []
))
const storeImageUrl = computed(() => resolveFileUrl(store.value?.imageUrl))
const selectedMenus = computed(() => (
  menus.value.filter((menu) => selectedMenuIds.value.includes(menu.menuId))
))
const canRequestReservation = computed(() => selectedMenuIds.value.length > 0)

const loadStoreDetail = async () => {
  selectedMenuIds.value = []
  await storeDetailStore.fetchStoreDetail(storeId.value)
}

const toggleMenu = (menuId) => {
  const index = selectedMenuIds.value.indexOf(menuId)

  if (index === -1) {
    selectedMenuIds.value.push(menuId)
    return
  }

  selectedMenuIds.value.splice(index, 1)
}

const goReservationCreate = () => {
  if (!canRequestReservation.value || !store.value) return

  reservationDraftStore.setDraft({
    store: {
      storeId: store.value.storeId,
      imageUrl: store.value.imageUrl,
      businessName: store.value.businessName,
      businessNumber: store.value.businessNumber,
    },
    selectedMenus: selectedMenus.value,
  })

  router.push('/reservation/create')
}

onMounted(loadStoreDetail)

watch(
  () => route.params.storeId,
  () => {
    loadStoreDetail()
  },
)
</script>

<template>
  <main class="page-body">
    <div class="container container--lg store-detail-page">
      <section v-if="storeDetailStore.isLoading" class="empty-state card">
        업체 상세 정보를 불러오는 중입니다.
      </section>

      <section v-else-if="storeDetailStore.errorMessage" class="empty-state card">
        <p>{{ storeDetailStore.errorMessage }}</p>

        <BaseButton
          variant="ghost"
          class="mt-4"
          @click="router.push('/storelist')"
        >
          업체 목록으로
        </BaseButton>
      </section>

      <template v-else-if="store">
        <section class="store-hero card">
          <div class="store-hero-image">
            <img
              v-if="storeImageUrl"
              :src="storeImageUrl"
              :alt="`${store.businessName} 대표 이미지`"
            >
            <span v-else>{{ store.businessName }}</span>
          </div>

          <div class="store-hero-info">
            <p class="store-eyebrow">업체 상세</p>
            <h1>{{ store.businessName }}</h1>

            <dl class="store-info-list">
              <div>
                <dt>사업자 번호</dt>
                <dd>{{ store.businessNumber || '-' }}</dd>
              </div>
            </dl>
          </div>
        </section>

        <section class="detail-section">
          <div class="section-heading">
            <div>
              <h2>메뉴 선택</h2>
              <p>견적 요청에 포함할 메뉴를 선택해 주세요.</p>
            </div>

            <span class="selected-count">
              {{ selectedMenuIds.length }}개 선택
            </span>
          </div>

          <div v-if="menus.length === 0" class="empty-state card">
            등록된 메뉴가 없습니다.
          </div>

          <div v-else class="menu-grid">
            <article
              v-for="menu in menus"
              :key="menu.menuId"
              :class="[
                'menu-card',
                'card',
                { 'menu-card--active': selectedMenuIds.includes(menu.menuId) },
              ]"
              @click="toggleMenu(menu.menuId)"
            >
              <div class="menu-image">
                <img
                  v-if="resolveFileUrl(menu.imageUrl)"
                  :src="resolveFileUrl(menu.imageUrl)"
                  :alt="`${menu.name} 이미지`"
                >
                <span v-else>{{ menu.name }}</span>
              </div>

              <div class="menu-body">
                <div class="menu-title-row">
                  <h3>{{ menu.name }}</h3>
                  <input
                    type="checkbox"
                    :checked="selectedMenuIds.includes(menu.menuId)"
                    :aria-label="`${menu.name} 선택`"
                    @click.stop
                    @change="toggleMenu(menu.menuId)"
                  >
                </div>

                <p class="menu-desc">
                  {{ menu.description || '메뉴 설명이 없습니다.' }}
                </p>

                <p class="menu-price">
                  {{ Number(menu.price || 0).toLocaleString() }}원
                </p>
              </div>
            </article>
          </div>
        </section>

        <div class="detail-actions">
          <BaseButton variant="ghost" @click="router.push('/storelist')">
            목록으로
          </BaseButton>

          <BaseButton
            variant="primary"
            :disabled="!canRequestReservation"
            @click="goReservationCreate"
          >
            견적 요청
          </BaseButton>
        </div>
      </template>
    </div>
  </main>
</template>

<style scoped>
.store-detail-page {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

.store-hero {
  display: grid;
  grid-template-columns: minmax(280px, 420px) 1fr;
  gap: var(--space-6);
  padding: 0;
  overflow: hidden;
}

.store-hero-image {
  min-height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fed7aa;
  color: #9a3412;
  font-size: var(--text-xl);
  font-weight: 900;
}

.store-hero-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.store-hero-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--space-5);
  padding: var(--space-8);
}

.store-eyebrow {
  color: var(--color-primary);
  font-size: var(--text-sm);
  font-weight: 900;
}

.store-hero-info h1 {
  color: var(--color-text);
  font-size: var(--text-5xl);
  font-weight: 900;
}

.store-info-list {
  margin: 0;
}

.store-info-list div {
  display: flex;
  gap: var(--space-4);
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border);
}

.store-info-list dt {
  min-width: 100px;
  color: var(--color-text-muted);
  font-weight: 700;
}

.store-info-list dd {
  margin: 0;
  color: var(--color-text);
  font-weight: 800;
}

.detail-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.section-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-4);
}

.section-heading h2 {
  color: var(--color-text);
  font-size: var(--text-4xl);
  font-weight: 900;
}

.section-heading p {
  margin-top: var(--space-2);
  color: var(--color-text-muted);
  font-size: var(--text-md);
}

.selected-count {
  flex-shrink: 0;
  padding: 8px 14px;
  border-radius: var(--radius-full);
  background: #fff7ed;
  color: var(--color-primary);
  font-weight: 900;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-5);
}

.menu-card {
  overflow: hidden;
  padding: 0;
  cursor: pointer;
  transition:
    border-color var(--transition-fast),
    box-shadow var(--transition-fast),
    transform var(--transition-fast);
}

.menu-card:hover,
.menu-card--active {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.menu-image {
  height: 170px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #ffedd5;
  color: var(--color-primary);
  font-weight: 900;
}

.menu-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.menu-body {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-5);
}

.menu-title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-3);
}

.menu-title-row h3 {
  color: var(--color-text);
  font-size: var(--text-lg);
  font-weight: 900;
}

.menu-title-row input {
  width: 20px;
  height: 20px;
  accent-color: var(--color-primary);
}

.menu-desc {
  min-height: 44px;
  color: var(--color-text-muted);
  font-size: var(--text-base);
  line-height: 1.6;
}

.menu-price {
  color: var(--color-primary);
  font-size: var(--text-lg);
  font-weight: 900;
}

.detail-actions {
  position: sticky;
  bottom: var(--space-4);
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  padding: var(--space-4);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-xl);
  background: rgba(255, 255, 255, 0.95);
  box-shadow: var(--shadow-lg);
}

@media (max-width: 1024px) {
  .store-hero,
  .menu-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 680px) {
  .store-hero,
  .menu-grid {
    grid-template-columns: 1fr;
  }

  .section-heading,
  .detail-actions {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
