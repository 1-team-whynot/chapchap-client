<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import BaseButton from '../../common/components/BaseButton.vue'
import { resolveFileUrl } from '../../../utils/resolveFileUrl.js'
import { useMyRequestsStore } from '../stores/useMyRequestsStore.js'

const route = useRoute()
const router = useRouter()
const myRequestsStore = useMyRequestsStore()

const createdReservationId = computed(() => String(route.query.created || ''))

const statusLabels = {
  REQUESTED: '견적 요청',
  ESTIMATED: '견적 완료',
  CONFIRMED: '예약 확정',
  PAYMENT_COMPLETED: '결제 완료',
  COMPLETED: '진행 완료',
  CANCELED: '취소',
}

const getStatusLabel = (status) => statusLabels[status] ?? status

const getPowerText = (powerAvailable) => (
  powerAvailable ? '전기 사용 가능' : '전기 사용 불가'
)

const getPriceText = (price) => (
  price === null || price === undefined
    ? '-'
    : `${Number(price).toLocaleString()}원`
)

onMounted(() => {
  const page = Number(route.query.page || 1)
  myRequestsStore.fetchMyRequests(Number.isNaN(page) ? 1 : page)
})
</script>

<template>
  <main class="page-body">
    <div class="container container--lg my-requests-page">
      <header class="page-header">
        <h1 class="page-header-title">내 요청 목록</h1>
        <p class="page-header-desc">
          내가 보낸 견적 요청과 진행 상태를 확인합니다.
        </p>
      </header>

      <p v-if="createdReservationId" class="alert alert--success">
        견적 요청이 접수되었습니다. 요청 번호 {{ createdReservationId }}번을 확인해 주세요.
      </p>

      <section v-if="myRequestsStore.isLoading" class="empty-state card">
        내 요청 목록을 불러오는 중입니다.
      </section>

      <section v-else-if="myRequestsStore.errorMessage" class="empty-state card">
        <p>{{ myRequestsStore.errorMessage }}</p>

        <BaseButton
          variant="ghost"
          class="mt-4"
          @click="myRequestsStore.fetchMyRequests(myRequestsStore.currentPage)"
        >
          다시 불러오기
        </BaseButton>
      </section>

      <section v-else-if="myRequestsStore.reservations.length === 0" class="empty-state card">
        <p>{{ myRequestsStore.message || '조회된 요청 내역이 없습니다.' }}</p>

        <BaseButton variant="primary" class="mt-4" @click="router.push('/storelist')">
          업체 둘러보기
        </BaseButton>
      </section>

      <section v-else class="request-list">
        <article
          v-for="reservation in myRequestsStore.reservations"
          :key="reservation.reservationId"
          class="request-card card"
        >
          <div class="request-image">
            <img
              v-if="resolveFileUrl(reservation.imageUrl)"
              :src="resolveFileUrl(reservation.imageUrl)"
              :alt="`${reservation.businessName} 대표 이미지`"
            >
            <span v-else>{{ reservation.businessName }}</span>
          </div>

          <div class="request-content">
            <div class="request-title-row">
              <div>
                <span :class="['status-badge', `status-badge--${reservation.status}`]">
                  {{ getStatusLabel(reservation.status) }}
                </span>
                <h2>{{ reservation.businessName }}</h2>
              </div>

              <span class="request-id">요청 #{{ reservation.reservationId }}</span>
            </div>

            <div class="request-info-grid">
              <div class="info-row">
                <span class="info-label">행사 일자</span>
                <span class="info-value">
                  {{ reservation.eventStartDate }} ~ {{ reservation.eventEndDate }}
                </span>
              </div>

              <div class="info-row">
                <span class="info-label">행사 장소</span>
                <span class="info-value">
                  {{ reservation.addrBase }} {{ reservation.addrDetail }}
                </span>
              </div>

              <div class="info-row">
                <span class="info-label">예상 인원</span>
                <span class="info-value">{{ reservation.headcount }}명</span>
              </div>

              <div class="info-row">
                <span class="info-label">전기 사용</span>
                <span class="info-value">
                  {{ getPowerText(reservation.powerAvailable) }}
                </span>
              </div>

              <div class="info-row">
                <span class="info-label">견적 금액</span>
                <span class="info-value">{{ getPriceText(reservation.quotedPrice) }}</span>
              </div>

              <div class="info-row">
                <span class="info-label">할인 금액</span>
                <span class="info-value">{{ getPriceText(reservation.discountPrice) }}</span>
              </div>
            </div>

            <div class="request-memo">
              <strong>요청 사항</strong>
              <p>{{ reservation.requestMemo || '작성된 요청 사항이 없습니다.' }}</p>
            </div>

            <div class="request-menus">
              <strong>선택 메뉴</strong>
              <div class="menu-chip-list">
                <span
                  v-for="menu in reservation.menus"
                  :key="menu.menuId"
                  class="menu-chip"
                >
                  {{ menu.name }}
                </span>
                <span v-if="!reservation.menus || reservation.menus.length === 0" class="menu-chip">
                  선택 메뉴 없음
                </span>
              </div>
            </div>
          </div>
        </article>
      </section>

      <nav
        v-if="myRequestsStore.pageRange.length > 1"
        class="pagination"
        aria-label="내 요청 목록 페이지"
      >
        <button
          type="button"
          :disabled="myRequestsStore.currentPage === 1 || myRequestsStore.isLoading"
          @click="myRequestsStore.changePage(myRequestsStore.currentPage - 1)"
        >
          이전
        </button>

        <button
          v-for="page in myRequestsStore.pageRange"
          :key="page"
          type="button"
          :class="{ active: myRequestsStore.currentPage === page }"
          :disabled="myRequestsStore.isLoading"
          @click="myRequestsStore.changePage(page)"
        >
          {{ page }}
        </button>

        <button
          type="button"
          :disabled="myRequestsStore.currentPage >= myRequestsStore.totalPages || myRequestsStore.isLoading"
          @click="myRequestsStore.changePage(myRequestsStore.currentPage + 1)"
        >
          다음
        </button>
      </nav>
    </div>
  </main>
</template>

<style scoped>
.my-requests-page {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.request-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.request-card {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: var(--space-5);
  overflow: hidden;
  padding: 0;
}

.request-image {
  min-height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #fed7aa;
  color: #9a3412;
  font-weight: 900;
  text-align: center;
}

.request-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.request-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: var(--space-5);
}

.request-title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);
}

.request-title-row h2 {
  margin-top: var(--space-2);
  color: var(--color-text);
  font-size: var(--text-xl);
  font-weight: 900;
}

.request-id {
  flex-shrink: 0;
  color: var(--color-text-muted);
  font-weight: 800;
}

.request-info-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-2) var(--space-5);
}

.request-info-grid .info-row {
  justify-content: flex-start;
}

.request-memo,
.request-menus {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border);
}

.request-memo strong,
.request-menus strong {
  color: var(--color-text);
  font-weight: 900;
}

.request-memo p {
  color: var(--color-text-muted);
  line-height: 1.6;
}

.menu-chip-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.menu-chip {
  display: inline-flex;
  padding: 6px 10px;
  border-radius: var(--radius-full);
  background: #fff7ed;
  color: var(--color-primary);
  font-size: var(--text-sm);
  font-weight: 800;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: var(--space-2);
}

.pagination button {
  min-width: 40px;
  padding: 9px 12px;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-white);
  color: var(--color-text-sub);
  font-weight: 800;
}

.pagination button.active {
  border-color: var(--color-primary);
  background: var(--color-primary);
  color: var(--color-white);
}

.pagination button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

@media (max-width: 820px) {
  .request-card,
  .request-info-grid {
    grid-template-columns: 1fr;
  }

  .request-title-row {
    flex-direction: column;
  }
}
</style>
