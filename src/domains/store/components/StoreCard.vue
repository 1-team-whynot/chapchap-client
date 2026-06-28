<script setup>
import { toRef } from 'vue';


const props = defineProps({
  store: {type: Object, required: true }
});

// 부모의 @select 함수 임포트
const emit = defineEmits(['select']);

</script>

<template>

  <!-- 카드 클릭 시 함수 select(store) 실행 -->
  <div class="store-card" @click="$emit('select', props.store)">

    <!-- 카드 배너 이미지 -->
    <div class="store-card-banner">
      <div class="store-card-img" :style="{backgroundImage: `url(${props.store.imageUrl})`}" 
      ></div>
    </div>
    
    <!-- 카드 본문 -->
    <div class="store-card-text">
    
      <!-- 업체명, 예약 가능 여부 -->
      <div class="store-card-title">
        <div class="store-card-name">{{ props.store.businessName }}</div>
        <span>
          예약가능
        </span>
      </div>
    
      <!-- 메뉴 카테고리, 지역 -->
      <p class="store-card-category">{{ props.store.foodCategoryNames }}, {{ props.store.addrBase }}</p>
      <p class="store-card-desc">{{ props.store.storeDesc }}</p>
    
      <!-- 카드 태그 -->
      <div class="store-card-tags">
        <span class="tag">최소 {{ props.store.minHeadcount }}명</span>
        <span class="tag">최대 {{ props.store.maxHeadcount }}명</span>
        <span v-if="props.store.isBatterySupported" class="tag">자체전원</span>
        <span v-else class="tag">전기필요</span>
      </div>
    </div>
  </div>

</template>

<style scoped>
.store-card {
  display: flex;
  flex-direction: column; 
  width: 100%;
  border: 1px solid #ddd;
  margin-bottom: 20px;
}

.store-card-banner {
  width: 100%;
  overflow: hidden;
}

.store-card-img {
  display: block;
  padding-top: 100%;
  width: 100%;
  padding-top: 60%;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>