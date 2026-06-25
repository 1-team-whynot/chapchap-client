<script setup>
import { useRouter } from 'vue-router';
import StoreCard from '../components/StoreCard.vue';
import { computed, onMounted } from 'vue';
import axios from 'axios';
import { useChecklistStore } from '../../checklist/stores/useChecklistStore.js';

const checklistStore = useChecklistStore();
const router = useRouter();

// 화면 로드 시, 필터링된 업체 목록 받아오기
onMounted(async() => {
  try {
    const url = '/api/stores';
    const params = checklistStore.filterParams;

    const res = await axios.get(url, {params});
    const data = res.data;
  
  } catch (error) {
    console.error(error);
    throw error;
  }
})

// -----------------------------------------------------------------------------
// 업체 더미 데이터 TODO: 백 구현 후 삭제
const STORES = [
  { id: 1, name: '맛있는 밥차', cats: ['한식'], region: '서울', minP: 50, maxP: 300, electricity: false, battery: true, gradFrom: '#FF6B00', gradTo: '#FFD200', available: true, bizNum: '123-45-67890', desc: '신선한 재료로 만드는 가정식 밥차. 기업·학교 행사 전문' },
  { id: 2, name: '달콤 푸드트럭', cats: ['분식', '카페·디저트'], region: '서울', minP: 20, maxP: 150, electricity: true, battery: false, gradFrom: '#16A34A', gradTo: '#4ADE80', available: true, bizNum: '234-56-78901', desc: '학교 축제·기업 행사 전문 분식 트럭. 떡볶이·튀김·음료' },
  { id: 3, name: '브루잉 카페트럭', cats: ['카페·디저트'], region: '경기', minP: 20, maxP: 100, electricity: true, battery: false, gradFrom: '#2563EB', gradTo: '#60A5FA', available: true, bizNum: '345-67-89012', desc: '스페셜티 커피와 수제 케이크 전문 카페 트럭' },
  { id: 4, name: '버거킹덤 트럭', cats: ['양식'], region: '경기', minP: 100, maxP: 500, electricity: false, battery: true, gradFrom: '#7C3AED', gradTo: '#A78BFA', available: true, bizNum: '456-78-90123', desc: '직화 수제버거 전문 트럭. 대규모 행사 경험 다수' },
  { id: 5, name: '향긋한 중화반점', cats: ['중식'], region: '인천', minP: 30, maxP: 200, electricity: true, battery: false, gradFrom: '#DC2626', gradTo: '#FB923C', available: false, bizNum: '567-89-01234', desc: '짜장면·짬뽕·볶음밥 전문. 푸짐한 중식 한 끼' },
  { id: 6, name: '스시 히로', cats: ['일식'], region: '서울', minP: 20, maxP: 80, electricity: true, battery: false, gradFrom: '#0F172A', gradTo: '#475569', available: true, bizNum: '678-90-12345', desc: '신선한 해산물로 만드는 스시·롤 전문 일식 트럭' },
];

// 체크리스트 조건에 맞는 업체 필터링 TODO: 삭제
//  이거 백엔드에서 해야 되는데 그럼, 엑시오스로 업체들을 담은 배열 데이터 요청, 요청할 때 필터링 정보 전달
const filterStores = computed(() => {
  return STORES.filter(store => {
    // 지역 필터링
  })
})
// -----------------------------------------------------------------------------
</script>

<template>
  <hr style="margin-top: 50px;">

  <div class="main">

    <!-- 페이지 제목 + 필터링한 조건 -->
    <div class="page-header">
      <h1>맞춤 트럭 목록</h1>
      <p style="margin: 30px;">스토어필터칩</p>
    </div>

    <!-- 결과 없음 -->
    <div v-if="true" class="empty-state">
      <div class="empty-state-title">조건에 맞는 트럭이 없어요</div>
      <div class="empty-state-desc">조건을 변경해보세요.</div>
      <button
        @click="router.push('/checklist')"
      >
        조건 다시 입력
      </button>
    </div>

    <!-- 업체 목록 카드 출력 -->
    <div v-else class="store-card-list">
      <StoreCard
        v-for="store in filterStores"
        :key="store.storeId"
        :store="store"
        @select="selectStore"
      />
       <!-- <p style="margin: 30px;">목록 컴포넌트</p> -->
    </div>
  </div>
</template>

<style scoped>

</style>