<script setup>
import { useRouter } from 'vue-router'


const props = defineProps({
  id: Number,     // 트럭 id 번호
  name: String,   // 트럭(스토어) 이름
  desc: String,   // 스토어 설명
  rating: Number, // 평점
  badge: String,  // 뱃지 텍스트 (예: '진행중', '한정')내 요청에서 쓸 것을 생각하며 만들었는데 필요없다면 삭제 할 예정
})

const router = useRouter()

// 대충 예약하기 버튼 누르면 해당 상세페이지로 가는거
const goToBooking = () => {
  router.push(`/trucks/${props.id}/asd`) // 예약 경로 확정 후 교체
}
</script>

<template>
  <article class="card">
    <div class="card-img"><span class="badge">{{ badge }}</span></div>
    <div class="text-button-box">
      <div class="text-box">
        <h4>{{ name }}</h4>
        <span class="desc">{{ desc }}</span>
      </div>
      <div class="button-box">
        <span class="rating">★ {{ rating }}</span>
        <button class="btn-primary btn-primary-sm" @click="goToBooking">예약하기</button>
      </div>
    </div>
  </article>
</template>

<style scoped>
.card {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  border: 1px solid var(--footer-color);
  border-radius: 16px;
  padding: 14px;
}

.card-img {
  position: relative;
  width: auto;
  height: 250px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  flex-shrink: 0;
  border-radius: 12px;
  background: linear-gradient(135deg, #e9e4dd, #cfd8d6);
}

.badge {
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
  margin-bottom: 6px;
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

.rating {
  font-size: 14px;
  font-weight: 700;
  color: var(--brand-color-orange);
}

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
</style>
