<script setup>

const props = defineProps({
  store: {type: Object, required: true },
});

// 부모의 @select 함수 임포트
defineEmits(['select']);

</script>

<template>
  <!-- 카드 클릭 시 함수 select(store) 실행 -->
  <div class="store-card" @click="$emit('select', store)">

    <!-- 카드 배너 이미지 -->
    <div class="store-card-banner">
      <span class="store-card-img">{{ img }}</span>
    </div>
    
    <!-- 카드 본문 -->
    <div class="store-card-text">
    
      <!-- 업체면, 예약 가능 여부 -->
      <div class="store-card-title">
        <span class="store-card-name">{{ name }}</span>
        <span>
          {{ '예약가능', '예약불가' }}
        </span>
      </div>
    
      <!-- 메뉴 카테고리, 지역 -->
      <p class="store-card-category">{{ foodCategory }}, {{ region }}</p>
      <p class="store-card-desc">{{ menuDesc }}</p>
    
      <!-- 카드 태그 -->
      <div class="store-card-tags">
        <span class="tag">최소 {{ minHeadcount }}명</span>
        <span class="tag">최대 {{ maxHeadcount }}명</span>
        <span v-if="store.isBatterySupported" class="tag">자체전원</span>
        <span v-else class="tag">전기필요</span>
      </div>
    </div>
  </div>

</template>

<style scoped>

</style>