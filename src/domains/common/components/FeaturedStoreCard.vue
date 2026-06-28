<script setup>
// 홈 화면 인기 트럭 카드 컴포넌트
// HomePage의 "인기 밥차·푸드트럭" 섹션에서 사용합니다.
// 그라데이션 배너 색상은 store.gradFrom, store.gradTo 데이터에서 가져옵니다.

const props = defineProps({
  store: { type: Object, required: true },
})

// 카테고리 이름을 이모지로 변환
function getCategoryEmoji(category) {
  const emojiMap = {
    '한식':      '🍱',
    '분식':      '🌶️',
    '양식':      '🍔',
    '중식':      '🍜',
    '일식':      '🍣',
    '카페·디저트': '☕',
  }
  return emojiMap[category] ?? '🍽️'
}
</script>

<template>
  <div class="featured-card card card--hover">

    <!-- 그라데이션 배너 -->
    <div class="featured-card-banner">
      <span class="featured-card-emoji">{{ getCategoryEmoji(store.cats[0]) }}</span>
    </div>

    <!-- 카드 본문 -->
    <div class="featured-card-body">
      <h3 class="featured-card-name">{{ store.name }}</h3>
      <p class="featured-card-cat">{{ store.cats.join(' · ') }} · {{ store.region }}</p>
      <p class="featured-card-desc">{{ store.desc }}</p>
    </div>

  </div>
</template>

<style scoped>
.featured-card {
  padding: 0;
  overflow: hidden;
}

/* v-bind()로 store.gradFrom, store.gradTo 값을 CSS에서 직접 사용합니다. */
.featured-card-banner {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, v-bind('props.store.gradFrom'), v-bind('props.store.gradTo'));
}

.featured-card-emoji {
  font-size: 48px;
}

.featured-card-body {
  padding: var(--space-4);
}

.featured-card-name {
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 4px;
}

.featured-card-cat {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  margin-bottom: 10px;
}

.featured-card-desc {
  font-size: var(--text-base);
  color: var(--color-text-sub);
  line-height: 1.5;
}
</style>
