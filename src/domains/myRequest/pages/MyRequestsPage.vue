<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import BaseButton from '../../common/components/BaseButton.vue'
import BaseModal from '../../common/components/BaseModal.vue'
import { useMyRequestsStore } from '../../reservation/stores/useMyRequestsStore.js'

const route = useRoute()
const router = useRouter()
const myRequestsStore = useMyRequestsStore()

const selectedReservation = ref(null)
const createdReservationId = computed(() => String(route.query.created || ''))

const statusTabs = [
  { label: '전체', value: '' },
  { label: '완료', value: 'COMPLETED' },
]

const statusLabels = {
  REQUESTED: '견적 요청',
  ESTIMATED: '견적 도착',
  CONFIRMED: '예약 확정',
  PAYMENT_COMPLETED: '결제 완료',
  COMPLETED: '완료',
  CANCELED: '취소',
}

const emptyMessage = computed(() => (
  myRequestsStore.activeStatus === 'COMPLETED'
    ? '완료 상태인 요청이 없습니다.'
    : myRequestsStore.message || '조회된 요청 내역이 없습니다.'
))

const getStatusLabel = (status) => statusLabels[status] ?? status

const getPowerText = (powerAvailable) => (
  powerAvailable ? '전기 사용 가능' : '전기 사용 불가'
)

const getPriceText = (price) => (
  price === null || price === undefined
    ? '-'
    : `${Number(price).toLocaleString()}원`
)

const getAddressText = (reservation) => (
  [reservation.addrBase, reservation.addrDetail].filter(Boolean).join(' ')
)

const getEventDateText = (reservation) => (
  `${reservation.eventStartDate || '-'} ~ ${reservation.eventEndDate || '-'}`
)

const openReservationDetail = (reservation) => {
  selectedReservation.value = reservation
}

const closeReservationDetail = () => {
  selectedReservation.value = null
}

const changeStatus = async (status) => {
  closeReservationDetail()
  await myRequestsStore.changeStatus(status)
}

onMounted(() => {
  const page = Number(route.query.page || 1)
  const status = route.query.status === 'COMPLETED' ? 'COMPLETED' : ''

  myRequestsStore.fetchMyRequests(Number.isNaN(page) ? 1 : page, status)
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

      <div class="status-tabs" role="tablist" aria-label="내 요청 상태 필터">
        <button
          v-for="tab in statusTabs"
          :key="tab.label"
          type="button"
          role="tab"
          :aria-selected="myRequestsStore.activeStatus === tab.value"
          :class="['status-tab', { 'status-tab--active': myRequestsStore.activeStatus === tab.value }]"
          :disabled="myRequestsStore.isLoading"
          @click="changeStatus(tab.value)"
        >
          {{ tab.label }}
        </button>
      </div>

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
        <p>{{ emptyMessage }}</p>

        <BaseButton variant="primary" class="mt-4" @click="router.push('/storelist')">
          업체 둘러보기
        </BaseButton>
      </section>

      <section v-else class="request-list">
        <article
          v-for="reservation in myRequestsStore.reservations"
          :key="reservation.reservationId"
          class="request-summary-card card"
        >
          <div class="request-summary-main">
            <div class="request-summary-header">
              <span :class="['status-badge', `status-badge--${reservation.status}`]">
                {{ getStatusLabel(reservation.status) }}
              </span>
              <h2>{{ reservation.businessName }}</h2>
            </div>

            <div class="request-summary-info">
              <div class="info-row">
                <span class="info-label">행사 일정</span>
                <span class="info-value">{{ getEventDateText(reservation) }}</span>
              </div>

              <div class="info-row">
                <span class="info-label">행사 장소</span>
                <span class="info-value">{{ getAddressText(reservation) || '-' }}</span>
              </div>
            </div>
          </div>

          <BaseButton
            variant="outline"
            size="sm"
            class="request-detail-button"
            @click="openReservationDetail(reservation)"
          >
            상세 보기
          </BaseButton>
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

      <BaseModal
        :show="Boolean(selectedReservation)"
        size="lg"
        @close="closeReservationDetail"
      >
        <div v-if="selectedReservation" class="request-detail-modal">
          <header class="request-detail-header">
            <div>
              <span :class="['status-badge', `status-badge--${selectedReservation.status}`]">
                {{ getStatusLabel(selectedReservation.status) }}
              </span>
              <h2>{{ selectedReservation.businessName }}</h2>
              <p>요청 #{{ selectedReservation.reservationId }}</p>
            </div>
          </header>

          <div class="request-detail-grid">
            <div class="info-row">
              <span class="info-label">행사 일정</span>
              <span class="info-value">{{ getEventDateText(selectedReservation) }}</span>
            </div>

            <div class="info-row">
              <span class="info-label">행사 장소</span>
              <span class="info-value">{{ getAddressText(selectedReservation) || '-' }}</span>
            </div>

            <div class="info-row">
              <span class="info-label">예상 인원</span>
              <span class="info-value">{{ selectedReservation.headcount }}명</span>
            </div>

            <div class="info-row">
              <span class="info-label">전기 사용</span>
              <span class="info-value">{{ getPowerText(selectedReservation.powerAvailable) }}</span>
            </div>

            <div class="info-row">
              <span class="info-label">견적 금액</span>
              <span class="info-value">{{ getPriceText(selectedReservation.quotedPrice) }}</span>
            </div>

            <div class="info-row">
              <span class="info-label">할인 금액</span>
              <span class="info-value">{{ getPriceText(selectedReservation.discountPrice) }}</span>
            </div>
          </div>

          <section class="request-detail-section">
            <h3>선택 메뉴</h3>
            <div class="menu-chip-list">
              <span
                v-for="menu in selectedReservation.menus"
                :key="menu.menuId"
                class="menu-chip"
              >
                {{ menu.name }}
              </span>
              <span
                v-if="!selectedReservation.menus || selectedReservation.menus.length === 0"
                class="menu-chip"
              >
                선택 메뉴 없음
              </span>
            </div>
          </section>

          <section class="request-detail-section">
            <h3>요청 사항</h3>
            <p>{{ selectedReservation.requestMemo || '작성된 요청 사항이 없습니다.' }}</p>
          </section>

          <footer class="request-detail-actions">
            <BaseButton variant="ghost" @click="closeReservationDetail">
              닫기
            </BaseButton>
          </footer>
        </div>
      </BaseModal>
    </div>
  </main>
</template>

<style scoped>
.page-body {
  padding: 150px 0;
}

.my-requests-page {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.status-tabs {
  display: flex;
  gap: var(--space-2);
}

.status-tab {
  min-width: 76px;
  padding: 10px 18px;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-full);
  background: var(--color-white);
  color: var(--color-text-muted);
  font-weight: 800;
}

.status-tab--active {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.status-tab:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.request-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.request-summary-card {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: var(--space-5);
}

.request-summary-main {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  min-width: 0;
}

.request-summary-header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.request-summary-header h2 {
  min-width: 0;
  color: var(--color-text);
  font-size: var(--text-xl);
  font-weight: 900;
  overflow-wrap: anywhere;
}

.request-summary-info {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-3) var(--space-5);
}

.request-summary-info .info-row {
  justify-content: flex-start;
  min-width: 0;
  padding: 0;
}

.request-summary-info .info-value {
  min-width: 0;
  overflow-wrap: anywhere;
}

.request-detail-button {
  align-self: center;
}

.request-detail-modal {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  padding: var(--space-6);
}

.request-detail-header {
  display: flex;
  justify-content: space-between;
  gap: var(--space-4);
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--color-border);
}

.request-detail-header h2 {
  margin-top: var(--space-2);
  color: var(--color-text);
  font-size: var(--text-3xl);
  font-weight: 900;
}

.request-detail-header p {
  margin-top: var(--space-1);
  color: var(--color-text-muted);
  font-weight: 800;
}

.request-detail-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-2) var(--space-5);
}

.request-detail-grid .info-row {
  align-items: flex-start;
  justify-content: flex-start;
}

.request-detail-grid .info-value {
  overflow-wrap: anywhere;
}

.request-detail-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border);
}

.request-detail-section h3 {
  margin: 0;
  color: var(--color-text);
  font-size: var(--text-lg);
  font-weight: 900;
}

.request-detail-section p {
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

.request-detail-actions {
  display: flex;
  justify-content: flex-end;
  padding-top: var(--space-2);
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
  .request-summary-card,
  .request-summary-info,
  .request-detail-grid {
    grid-template-columns: 1fr;
  }

  .request-summary-card {
    align-items: stretch;
  }

  .request-detail-button {
    justify-self: flex-start;
  }
}
</style>
