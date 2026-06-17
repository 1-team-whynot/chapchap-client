<script setup>
// 추천 트럭 (나중에 API로 교체)
const trucks = [
  {
    name: '오리지널 타코 하우스',
    desc: '전통 방식 그대로의 핸드메이드 또띠아와 육즙 가득한 까르니따스를 제공합니다.',
    rating: 4.8,
    badge: '진행중',
  },
  {
    name: '나폴리 화덕 피자',
    desc: '장작 화덕에서 구워낸 정통 나폴리 피자를 행사 현장에서 바로 구워 드립니다.',
    rating: 5.0,
    badge: '한정',
  },
]

// 선택 이유
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
          <a class="view-all">전체보기 ›</a>
        </div>
        <div class="truck-list">
          <article class="card" v-for="t in trucks" :key="t.name">
            <div class="card-img"><span class="badge">{{ t.badge }}</span></div>
            <div class="text-button-box">
              <div class="text-box">
                <h4>{{ t.name }}</h4>
                <span class="desc">{{ t.desc }}</span>
              </div>
              <div class="button-box">
                <span class="rating">★ {{ t.rating }}</span>
                <button class="btn-primary btn-primary-sm ">예약하기</button>
              </div>
            </div>
          </article>
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
  --accent: #ff7a1a;
  --accent-2: #ff9d4d;
  --muted: #8a8f98;
  --line: #ededed;
  --soft: #fff6ef;
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

/* 버튼 */
.btn-primary {
  border: none;
  border-radius: 10px;
  background-color: var(--brand-color-orange); 
  color: #fff;
  font-weight: 700;
  cursor: pointer;
}

.btn-primary-sm {
  padding: 8px 14px; 
  font-size: 13px; 
  box-shadow: 2px 4px 2px rgba(0, 0, 0, 0.37);
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

.hero-text .btn-primary { 
  margin-top: 28px; 
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

.card {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: 14px;
}

.card-img {
  position: relative; /* 뱃지의 위치를 조정하기위해 뱃지의 부모인 카드이미지에게 릴렉티브 요소를 부여함 */
  width: auto;
  height: 250px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url(/public/Pizza\ Truck.svg);
  flex-shrink: 0; /* 화면이 줄어도 사진이 찌그러짐을 방지하기 위해 사용함 */
  border-radius: 12px;
  /* background: linear-gradient(135deg, #e9e4dd, #cfd8d6); 이미지로 교체 */
}

.badge { /* 안쓸거라면 삭제 */
  position: absolute; top: 8px; left: 8px;
  background: rgba(0,0,0,0.55); 
  color: #fff;
  font-size: 11px; 
  padding: 3px 8px; 
  border-radius: 6px;
}

.text-button-box { 
  display: flex; 
  flex-direction: column; 
  justify-content: space-between; 
  flex: 1; 
}

.text-box h4 { 
  font-size: 16px; 
  margin-bottom: 6px; /* 마진 바텀이 없다면 텍스트가 너무 붙어있음 */
}

.text-box .desc { 
  font-size: 13px; 
  line-height: 1.5; 
}

.button-box { 
  display: flex; 
  align-items: center; 
  justify-content: space-between; 
  margin-top: 12px; 
  
}

.rating { /* 리뷰 점수 */
  font-size: 14px; 
  font-weight: 700; 
  color: var(--brand-color-orange); 
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