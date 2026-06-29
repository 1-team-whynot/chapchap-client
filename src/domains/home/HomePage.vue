<script setup>
import { onMounted, ref } from 'vue'

import myAxios from '../api/myAxios.js'

const checklistLink = '/checklist'
const storeListLink = '/storelist'

const featuredStores = ref([])
const isStoreLoading = ref(false)
const storeErrorMessage = ref('')

const getTextFromArray = (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    return ''
  }

  return items.join(' · ')
}

const normalizeStore = (store) => {
  const batterySupported = store.batterySupported ?? store.isBatterySupported ?? false

  return {
    id: store.storeId,
    name: store.businessName,
    category: getTextFromArray(store.categoryNames) || '카테고리 미정',
    region: getTextFromArray(store.regionNames) || '지역 미정',
    description: store.storeDesc,
    status: batterySupported ? '배터리 지원' : '견적 가능',
    imageUrl: store.imageUrl,
    imageText: store.businessName,
    headcountText: `${store.minHeadcount}명 ~ ${store.maxHeadcount}명`,
  }
}

const loadFeaturedStores = async () => {
  isStoreLoading.value = true
  storeErrorMessage.value = ''

  try {
    const response = await myAxios.get('/api/allStores')
    const storeList = Array.isArray(response.data?.data) ? response.data.data : []

    featuredStores.value = storeList
      .slice(0, 4)
      .map(normalizeStore)
      .filter((store) => store.id)
  } catch (error) {
    console.error(error)
    storeErrorMessage.value = '업체 정보를 불러오지 못했습니다.'
  } finally {
    isStoreLoading.value = false
  }
}

onMounted(() => {
  loadFeaturedStores()
})

const howItWorks = [
  {
    step: 1,
    emoji: '📋',
    title: '조건 입력',
    description: '행사 지역, 날짜, 예상 인원, 메뉴 카테고리, 전기 사용 여부를 입력합니다.',
  },
  {
    step: 2,
    emoji: '🔍',
    title: '업체 탐색',
    description: '조건에 맞는 밥차와 푸드트럭을 확인합니다.',
  },
  {
    step: 3,
    emoji: '🍽️',
    title: '메뉴 확인',
    description: '행사 성격에 맞는 메뉴와 제공 방식을 비교합니다.',
  },
  {
    step: 4,
    emoji: '💬',
    title: '견적 요청',
    description: '원하는 업체에 견적을 요청하고 답변을 받습니다.',
  },
  {
    step: 5,
    emoji: '✅',
    title: '예약 확정',
    description: '업체와 조건을 확정한 뒤 계약금 결제로 예약합니다.',
  },
  {
    step: 6,
    emoji: '🎉',
    title: '행사 진행',
    description: '행사 당일 서비스를 이용하고 잔금을 정산합니다.',
  },
]

const useCases = [
  {
    emoji: '🏢',
    title: '기업 행사',
    description: '임직원 워크숍, 사내 행사, 브랜드 이벤트에 적합합니다.',
  },
  {
    emoji: '🎓',
    title: '학교 축제',
    description: '대학 축제, 동아리 행사, 입학·졸업 기념 행사에 어울립니다.',
  },
  {
    emoji: '🏘️',
    title: '지역 이벤트',
    description: '아파트 행사, 동네 축제, 플리마켓 같은 야외 행사에 좋습니다.',
  },
  {
    emoji: '🎊',
    title: '특별한 날',
    description: '생일파티, 팀빌딩, 스포츠 행사 뒤풀이에도 활용할 수 있습니다.',
  },
]
</script>

<template>
  <div class="page home-page">
    <main>
      <!-- ① 히어로 섹션 -->
      <section class="home-section hero-section">
        <span class="hero-float hero-float--1">🍱</span>
        <span class="hero-float hero-float--2">🚚</span>
        <span class="hero-float hero-float--3">🍔</span>
        <span class="hero-float hero-float--4">☕</span>

        <div class="container container--lg">
          <div class="hero-content">
            <p class="hero-pill">
              밥차·푸드트럭 중개 플랫폼
            </p>

            <h1 class="hero-title">
              행사 음식 준비,<br />
              <span>상다리에서 한 번에</span>
            </h1>

            <p class="hero-desc">
              기업 행사, 학교 축제, 지역 이벤트에 딱 맞는
              밥차와 푸드트럭을 손쉽게 비교하고 예약하세요.
            </p>

            <div class="hero-actions">
              <RouterLink :to="checklistLink" class="hero-main-btn">
                업체 둘러보기
              </RouterLink>
            </div>
          </div>
        </div>
      </section>

      <!-- ② 이용 방법 섹션 -->
      <section class="home-section section-white">
        <div class="container container--lg">
          <div class="section-center">
            <p class="section-label">HOW IT WORKS</p>
            <h2 class="section-title">행사 예약은 이렇게 진행돼요</h2>
            <p class="section-desc">
              복잡한 행사 음식 준비 과정을 단계별로 쉽게 진행할 수 있습니다.
            </p>
          </div>

          <div class="steps-grid">
            <article
              v-for="item in howItWorks"
              :key="item.step"
              class="step-card"
            >
              <div class="step-emoji">
                {{ item.emoji }}
              </div>

              <p class="step-number">
                STEP {{ item.step }}
              </p>

              <h3 class="step-title">
                {{ item.title }}
              </h3>

              <p class="step-desc">
                {{ item.description }}
              </p>
            </article>
          </div>
        </div>
      </section>

      <!-- ③ 인기 업체 섹션 -->
      <section class="home-section section-light">
        <div class="container container--lg">
          <div class="section-center">
            <p class="section-label">FEATURED</p>
            <h2 class="section-title">인기 밥차·푸드트럭</h2>
            <p class="section-desc">
              행사 목적과 지역에 맞는 다양한 업체를 비교해보세요.
            </p>
          </div>

          <div v-if="isStoreLoading" class="store-state-message">
            업체 정보를 불러오는 중입니다.
          </div>

          <div v-else-if="storeErrorMessage" class="store-state-message">
            {{ storeErrorMessage }}
          </div>

          <div v-else-if="featuredStores.length === 0" class="store-state-message">
            등록된 업체가 없습니다.
          </div>

          <div v-else class="featured-grid">
            <article
              v-for="store in featuredStores"
              :key="store.id"
              class="store-card"
            >
              <div class="store-image">
                <img
                  v-if="store.imageUrl"
                  :src="store.imageUrl"
                  :alt="store.name"
                  class="store-img"
                />

                <span v-else>
                  {{ store.imageText }}
                </span>
              </div>

              <div class="store-body">
                <div class="store-title-row">
                  <h3 class="store-title">
                    {{ store.name }}
                  </h3>

                  <span class="store-badge">
                    {{ store.status }}
                  </span>
                </div>

                <p class="store-meta">
                  {{ store.category }} · {{ store.region }}
                </p>

                <p class="store-headcount">
                  수용 인원 {{ store.headcountText }}
                </p>

                <p class="store-desc">
                  {{ store.description }}
                </p>

                <RouterLink :to="`/stores/${store.id}`" class="store-link">
                  상세보기
                </RouterLink>
              </div>
            </article>
          </div>

          <div class="text-center mt-6">
            <RouterLink :to="storeListLink" class="view-all-btn">
              전체 업체 보기 →
            </RouterLink>
          </div>
        </div>
      </section>

      <!-- ④ 사용 사례 섹션 -->
      <section class="home-section section-white">
        <div class="container container--lg">
          <div class="section-center">
            <p class="section-label">USE CASES</p>
            <h2 class="section-title">이런 행사에 잘 맞아요</h2>
            <p class="section-desc">
              상다리는 다양한 행사 상황에 맞는 업체 연결을 목표로 합니다.
            </p>
          </div>

          <div class="use-case-grid">
            <article
              v-for="item in useCases"
              :key="item.title"
              class="use-case-card"
            >
              <div class="use-case-emoji">
                {{ item.emoji }}
              </div>

              <h3 class="use-case-title">
                {{ item.title }}
              </h3>

              <p class="use-case-desc">
                {{ item.description }}
              </p>
            </article>
          </div>
        </div>
      </section>

      <!-- ⑤ CTA 섹션 -->
      <section class="home-section cta-section">
        <div class="container container--md">
          <h2 class="cta-title">
            지금 바로 맞는 업체를 둘러보세요
          </h2>

          <p class="cta-desc">
            원하는 행사 조건에 맞는 밥차와 푸드트럭 업체를 비교해보세요.
          </p>

          <RouterLink :to="checklistLink" class="cta-link-btn">
            업체 둘러보기
          </RouterLink>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
/* ============================
   Home Page
   ============================ */
.home-page {
  background: var(--color-bg);
}

.home-section {
  padding: var(--space-10) 0;
}

.section-white {
  background: var(--color-white);
}

.section-light {
  background: var(--color-bg);
}

/* ============================
   Hero
   ============================ */
.hero-section {
  position: relative;
  overflow: hidden;
  padding: 96px 0;
  background: url('../../assets/Hero-img.png') center / cover no-repeat;
}

.hero-section::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.35) 0%,
    rgba(255, 247, 237, 0.30) 40%,
    rgba(255, 255, 255, 0.40) 100%
  );
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 760px;
  margin: 0 auto;
  padding: 64px var(--space-6);
  border: 1.5px solid rgba(255, 255, 255, 0.85);
  border-radius: var(--radius-xl);
  background: rgba(255, 255, 255, 0.72);
  box-shadow:
    0 18px 50px rgba(15, 23, 42, 0.08),
    0 0 0 1px rgba(255, 255, 255, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  text-align: center;
  backdrop-filter: blur(18px) saturate(1.6);
  -webkit-backdrop-filter: blur(18px) saturate(1.6);
}

.hero-pill {
  display: inline-block;
  margin-bottom: var(--space-5);
  padding: 8px 18px;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, #ffedd5 0%, #fef3c7 100%);
  color: var(--color-primary);
  font-size: var(--text-sm);
  font-weight: 800;
  box-shadow: 0 2px 8px rgba(255, 107, 0, 0.10);
}

.hero-title {
  margin: 0;
  color: var(--color-text);
  font-size: 56px;
  font-weight: 900;
  line-height: 1.15;
  letter-spacing: -1.8px;
}

.hero-title span {
  background: linear-gradient(135deg, #ff6b00 0%, #f43f5e 40%, #a855f7 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 200% 200%;
  animation: gradientShift 6s ease-in-out infinite;
}

@keyframes gradientShift {
  0%, 100% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }
}

.hero-desc {
  max-width: 620px;
  margin: var(--space-5) auto var(--space-8);
  color: var(--color-text-muted);
  font-size: var(--text-lg);
  line-height: 1.7;
}

.hero-actions {
  display: flex;
  justify-content: center;
  gap: var(--space-3);
  flex-wrap: wrap;
}

.hero-main-btn,
.view-all-btn,
.store-link,
.cta-link-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-lg);
  font-weight: 800;
  text-decoration: none;
  transition:
    background var(--transition-fast),
    color var(--transition-fast),
    border-color var(--transition-fast),
    box-shadow var(--transition-fast),
    transform var(--transition-fast),
    opacity var(--transition-fast);
}

.hero-main-btn {
  min-width: 180px;
  padding: 16px 34px;
  background: linear-gradient(135deg, #ff6b00 0%, #f97316 50%, #fb923c 100%);
  color: var(--color-white);
  box-shadow:
    0 12px 28px rgba(255, 107, 0, 0.30),
    0 0 0 1px rgba(255, 107, 0, 0.15);
}

.hero-main-btn:hover {
  background: linear-gradient(135deg, #ea580c 0%, #f97316 100%);
  color: var(--color-white);
  transform: translateY(-2px);
  box-shadow:
    0 16px 36px rgba(255, 107, 0, 0.38),
    0 0 0 1px rgba(255, 107, 0, 0.20);
}

/* ============================
   Section Header
   ============================ */
.section-center {
  margin-bottom: var(--space-8);
  text-align: center;
}

.section-label {
  color: var(--color-primary);
  font-size: var(--text-sm);
  font-weight: 900;
  letter-spacing: 0.08em;
}

.section-title {
  margin-top: var(--space-2);
  color: var(--color-text);
  font-size: var(--text-5xl);
  font-weight: 900;
  letter-spacing: -1px;
}

.section-desc {
  max-width: 620px;
  margin: var(--space-3) auto 0;
  color: var(--color-text-muted);
  font-size: var(--text-md);
  line-height: 1.7;
}

/* ============================
   Steps
   ============================ */
.steps-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-5);
}

.step-card {
  padding: var(--space-6);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-xl);
  background: var(--color-white);
  box-shadow: var(--shadow-sm);
  text-align: center;
  transition:
    transform var(--transition-base),
    box-shadow var(--transition-base),
    border-color var(--transition-base);
}

.step-card:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-lg);
  transform: translateY(-4px);
}

.step-emoji {
  margin-bottom: var(--space-3);
  font-size: 34px;
}

.step-number {
  color: var(--color-primary);
  font-size: var(--text-sm);
  font-weight: 900;
}

.step-title {
  margin-top: var(--space-2);
  color: var(--color-text);
  font-size: var(--text-xl);
  font-weight: 800;
}

.step-desc {
  margin-top: var(--space-2);
  color: var(--color-text-muted);
  font-size: var(--text-base);
  line-height: 1.6;
}

/* ============================
   Featured Stores
   ============================ */
.featured-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-5);
}

.store-card {
  overflow: hidden;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-xl);
  background: var(--color-white);
  box-shadow: var(--shadow-sm);
  transition:
    transform var(--transition-base),
    box-shadow var(--transition-base),
    border-color var(--transition-base);
}

.store-card:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-lg);
  transform: translateY(-4px);
}

.store-image {
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #fed7aa;
  color: #9a3412;
  font-size: var(--text-sm);
  font-weight: 900;
  letter-spacing: 0.08em;
}

.store-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.store-body {
  padding: var(--space-5);
}

.store-title-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-3);
}

.store-title {
  color: var(--color-text);
  font-size: var(--text-lg);
  font-weight: 900;
  line-height: 1.35;
}

.store-badge {
  flex-shrink: 0;
  padding: 5px 9px;
  border-radius: var(--radius-full);
  background: #ffedd5;
  color: var(--color-primary);
  font-size: var(--text-sm);
  font-weight: 800;
}

.store-meta {
  margin-top: var(--space-2);
  color: var(--color-text-sub);
  font-size: var(--text-sm);
  font-weight: 700;
}

.store-headcount {
  margin-top: var(--space-2);
  color: var(--color-text-muted);
  font-size: var(--text-sm);
  font-weight: 700;
}

.store-desc {
  min-height: 72px;
  margin-top: var(--space-3);
  color: var(--color-text-muted);
  font-size: var(--text-base);
  line-height: 1.6;
}

.store-link {
  width: 100%;
  margin-top: var(--space-4);
  padding: 12px 16px;
  background: var(--color-primary);
  color: var(--color-white);
  font-size: var(--text-base);
  box-shadow: 0 10px 22px rgba(255, 107, 0, 0.22);
}

.store-link:hover {
  background: var(--color-primary-hover);
  color: var(--color-white);
  box-shadow: 0 14px 28px rgba(255, 107, 0, 0.28);
  transform: translateY(-2px);
}

.store-state-message {
  padding: var(--space-8);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-xl);
  background: var(--color-white);
  color: var(--color-text-muted);
  font-size: var(--text-md);
  font-weight: 700;
  text-align: center;
}

.view-all-btn {
  padding: 12px 32px;
  border: 1.5px solid var(--color-primary);
  color: var(--color-primary);
  font-size: var(--text-md);
}

.view-all-btn:hover {
  background: var(--color-primary);
  color: var(--color-white);
  transform: translateY(-2px);
}

/* ============================
   Use Cases
   ============================ */
.use-case-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-5);
}

.use-case-card {
  padding: var(--space-6);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-xl);
  background: var(--color-white);
  box-shadow: var(--shadow-sm);
  text-align: center;
}

.use-case-emoji {
  margin-bottom: var(--space-3);
  font-size: 36px;
}

.use-case-title {
  color: var(--color-text);
  font-size: var(--text-xl);
  font-weight: 900;
}

.use-case-desc {
  margin-top: var(--space-2);
  color: var(--color-text-muted);
  font-size: var(--text-base);
  line-height: 1.6;
}

/* ============================
   CTA
   ============================ */
.cta-section {
  background: linear-gradient(135deg, var(--color-primary), #fb923c);
  color: var(--color-white);
  text-align: center;
}

.cta-title {
  margin: 0;
  font-size: var(--text-5xl);
  font-weight: 900;
  letter-spacing: -1px;
}

.cta-desc {
  margin: var(--space-4) 0 var(--space-6);
  color: rgba(255, 255, 255, 0.9);
  font-size: var(--text-lg);
  line-height: 1.7;
}

.cta-link-btn {
  padding: 14px 36px;
  background: var(--color-white);
  color: var(--color-primary);
  font-size: var(--text-xl);
}

.cta-link-btn:hover {
  opacity: 0.92;
  transform: translateY(-2px);
}

/* ============================
   Responsive
   ============================ */
@media (max-width: 1024px) {
  .featured-grid,
  .use-case-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .steps-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 72px 0;
  }

  .hero-content {
    padding: 48px var(--space-5);
  }

  .hero-title {
    font-size: 42px;
  }

  .section-title,
  .cta-title {
    font-size: var(--text-4xl);
  }

  .hero-desc,
  .cta-desc {
    font-size: var(--text-md);
  }
}

@media (max-width: 560px) {
  .home-section {
    padding: 64px 0;
  }

  .hero-section {
    padding: 56px 0;
  }

  .hero-content {
    padding: 40px var(--space-4);
  }

  .hero-title {
    font-size: 34px;
  }

  .hero-actions {
    flex-direction: column;
  }

  .hero-main-btn,
  .cta-link-btn {
    width: 100%;
  }

  .steps-grid,
  .featured-grid,
  .use-case-grid {
    grid-template-columns: 1fr;
  }
}
</style>