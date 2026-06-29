<script setup>
import { computed } from 'vue'

import { resolveFileUrl } from '../../../utils/resolveFileUrl.js'

const props = defineProps({
  store: { type: Object, required: true },
})

const imageUrl = computed(() => resolveFileUrl(props.store.imageUrl))
const categories = computed(() => props.store.foodCategoryNames || '카테고리 미정')
const batteryText = computed(() => (
  props.store.isBatterySupported ? '배터리 지원' : '전기 필요'
))
</script>

<template>
  <article class="store-card card">
    <div class="store-card-image">
      <img
        v-if="imageUrl"
        :src="imageUrl"
        :alt="`${store.businessName} 대표 이미지`"
      >
      <span v-else>{{ store.businessName }}</span>
    </div>

    <div class="store-card-body">
      <div class="store-card-title-row">
        <h2>{{ store.businessName }}</h2>
        <span class="store-card-badge">{{ batteryText }}</span>
      </div>

      <p class="store-card-meta">
        {{ categories }} · {{ store.addrBase || '지역 미정' }}
      </p>

      <p class="store-card-headcount">
        수용 인원 {{ store.minHeadcount }}명 ~ {{ store.maxHeadcount }}명
      </p>

      <p class="store-card-desc">
        {{ store.storeDesc || '업체 소개가 없습니다.' }}
      </p>

      <RouterLink :to="`/stores/${store.storeId}`" class="store-card-link">
        상세 보기
      </RouterLink>
    </div>
  </article>
</template>

<style scoped>
.store-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 0;
}

.store-card-image {
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #fed7aa;
  color: #9a3412;
  font-size: var(--text-md);
  font-weight: 900;
}

.store-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.store-card-body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-5);
}

.store-card-title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-3);
}

.store-card-title-row h2 {
  color: var(--color-text);
  font-size: var(--text-lg);
  font-weight: 900;
  line-height: 1.35;
}

.store-card-badge {
  flex-shrink: 0;
  padding: 5px 9px;
  border-radius: var(--radius-full);
  background: #fff7ed;
  color: var(--color-primary);
  font-size: var(--text-sm);
  font-weight: 800;
}

.store-card-meta,
.store-card-headcount,
.store-card-desc {
  color: var(--color-text-muted);
  font-size: var(--text-base);
  line-height: 1.6;
}

.store-card-meta,
.store-card-headcount {
  font-weight: 700;
}

.store-card-desc {
  flex: 1;
}

.store-card-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: var(--space-2);
  padding: 11px 16px;
  border: 1.5px solid var(--color-primary);
  border-radius: var(--radius-lg);
  background: var(--color-primary);
  color: var(--color-white);
  font-weight: 800;
  text-decoration: none;
  transition:
    background var(--transition-fast),
    border-color var(--transition-fast);
}

.store-card-link:hover {
  border-color: var(--color-primary-hover);
  background: var(--color-primary-hover);
}
</style>
