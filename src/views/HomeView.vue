<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import CardComp from '../components/CardComp.vue'

const router = useRouter()


// 임시 트럭 데이터
const trucks = ref([
  {
    id: 1,
    name: '오리지널 타코 하우스',
    desc: '전통 방식 그대로의 핸드메이드 또띠아와 육즙 가득한 까르니따스를 제공합니다.',
    rating: 4.8,
    badge: '진행중',
  },
  {
    id: 2,
    name: '나폴리 화덕 피자',
    desc: '장작 화덕에서 구워낸 정통 나폴리 피자를 행사 현장에서 바로 구워 드립니다.',
    rating: 5.0,
    badge: '한정',
  },
])

// API 요청 중인지 나타내는 로딩 상태
const isLoading = ref(false)

onMounted(async () => {
  // 컴포넌트가 화면에 표시되면 추천 푸드트럭 데이터를 조회
  isLoading.value = true

  try {
    // 백엔드에 추천 푸드트럭 목록 요청
    const res = await axios.get('/api/trucks/recommended')

    // 응답받은 데이터를 화면에 사용할 trucks 상태에 저장
    trucks.value = res.data

  } catch (error) {
    // API 요청 실패 시 오류 확인
    console.error('추천 푸드트럭 조회 실패:', error)

  } finally {
    // 요청 성공 여부와 관계없이 로딩 상태 종료
    isLoading.value = false
  }
})

// 트럭 상세보기 페이지로 이동하는 함수
const goToTruckList = () => {
  router.push('/trucks')  // /trucks 경로로 페이지 이동 나중에 router.js에 경로 추가 필요
}

// 맨 밑에 동그란거 안에 들어갈 데이터들
const reasons = [
  { title: 'Fast Matching', desc: '빠른 매칭' },
  { title: 'Local Only', desc: '대구·경북 전문' },
  { title: 'Safe Payment', desc: '안전한 결제' },
  { title: 'Easy Request', desc: '간편한 견적' },
]
</script>

<template>
  <div class="page">

    <main class="container">

      <!-- 히어로 섹션 -->
      <section class="hero-section">
        <div class="hero-text">
          <h2>당신의<br />특별한 순간을 위한<br /><span class="accent">최고의 푸드트럭</span></h2>
        </div>
        <img class="hero-img" src="/image.png" alt="푸드트럭 일러스트" />
      </section>

      <!-- 추천 트럭 카드 리스트 -->
      <section class="truck-section">
        <div class="section-head">
          <p class="eyebrow">TRUCK</p>
          <a class="view-all" @click="goToTruckList">전체보기 ›</a>
        </div>
        <div class="truck-list">
          <CardComp
            v-for="t in trucks"
            :key="t.id"
            :id="t.id"
            :name="t.name"
            :desc="t.desc"
            :rating="t.rating"
            :badge="t.badge"
          />
        </div>
      </section>

      <!-- 선택받은자 -->
      <section class="self-introduction">
        <h2>Chap Chap을 선택해야 하는 이유</h2>
        <div class="ball-container">
          <div class="ball" v-for="r in reasons" :key="r.title">
            <strong>{{ r.title }}</strong>
            <span>{{ r.desc }}</span>
          </div>
        </div>
      </section>
    </main>

  </div>

</template>

<style scoped>
* { 
  margin: 0; 
  padding: 0; 
  box-sizing: border-box; 
}

.page {
  background: #FFFDF9;
  color: #4A3728;
}

/* 공통: 내용 가운데 정렬 컨테이너 */
.container {
  width: 100%;
  max-width: 1180px;
  margin: 0 auto;
  padding-left: 24px;
  padding-right: 24px;
}

/* 히어로 */
.hero-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 48px;
  padding: 72px 0;
}

.hero-text h2 { 
  font-size: 44px; 
  line-height: 1.3; 
  font-weight: 800; 
}

.hero-text .accent { 
  color: var(--brand-color-orange); 
}

.hero-img {
  width: 52%;
  max-width: 560px;
  height: auto;
  border-radius: 20px;
}

/* 섹션 헤더 */
.section-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 20px;
}

.eyebrow { 
  font-size: 14px; 
  font-weight: 800; 
  letter-spacing: 1px; 
}

.view-all { 
  font-size: 14px; 
  cursor: pointer; 
  color: var(--brand-color-orange);  
}

/* 추천 트럭 카드 */
.truck-list {
  display: flex;
  gap: 24px;
}

/* 선택 이유 */
.self-introduction { 
  text-align: center; 
  padding: 24px 0 8px; 
}

.self-introduction h2 { 
  font-size: 28px; 
  font-weight: 800; 
  margin-bottom: 36px; 
}

.ball-container { 
  display: flex; 
  gap: 24px; 
}

.ball { /* 사진으로 대체한다면 고쳐야함 */
  flex: 1;
  aspect-ratio: 1;
  border-radius: 50%;
  background: linear-gradient(135deg, #3a3a3a, #222); /* 이미지로 교체 시 삭제 */
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.ball strong { /* 사진으로 대체한다면 지워야함 */
  font-size: 15px; 
}

.ball span { /* 사진으로 대체한다면 지워야함 */
  font-size: 12px; 
  color: #d8d8d8; 
}

/* 반응형: 좁은 화면에서 세로로 */
@media (max-width: 768px) { /* 화면의 반응형 최대 크기를 지정 */
  .hero-section {  /* 히어로 섹션의 행을 column으로 변경 */
    flex-direction: column; 
    text-align: center; 
    padding: 40px 0; 
  }

  .hero-img { /* 히어로 이미지는 위드를 따라감 */
    width: 100%; 
  }

  .truck-list {  /* 트럭 리스트의 행을 column으로 변경 */
    flex-direction: column; 
  }

  .ball-container { /* 화면이 줄어들면 밑으로 내려갈수있게 함 */
    flex-wrap: wrap; 
  }

  .ball { /* 1대1 비율과 부모너비의 절반을 가져감 */
    flex: 1 1 calc(50% - 12px); 
  }


}
</style>