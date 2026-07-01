<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import BaseButton from '../../common/components/BaseButton.vue'
import BaseInput from '../../common/components/BaseInput.vue'
import { useReservationCreateStore } from '../stores/useReservationCreateStore.js'
import { useReservationDraftStore } from '../stores/useReservationDraftStore.js'

const router = useRouter()
const reservationDraftStore = useReservationDraftStore()
const reservationCreateStore = useReservationCreateStore()

const toDateInputValue = (date) => {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  return localDate.toISOString().slice(0, 10)
}

const createMinEventDate = () => {
  const date = new Date()
  date.setDate(date.getDate() + 14)
  return toDateInputValue(date)
}

const minEventDate = createMinEventDate()

const form = reactive({
  addrBase: '',
  addrDetail: '',
  eventStartDate: '',
  eventEndDate: '',
  headcount: '',
  requestMemo: '',
})

const hasDraft = computed(() => reservationDraftStore.hasDraft)

const dateMessage = computed(() => {
  if (form.eventStartDate && form.eventStartDate < minEventDate) {
    return '행사 시작 일자는 오늘 기준 14일 이후부터 선택할 수 있습니다.'
  }

  if (
    form.eventStartDate
    && form.eventEndDate
    && form.eventEndDate < form.eventStartDate
  ) {
    return '행사 종료 일자는 시작 일자보다 빠를 수 없습니다.'
  }

  return ''
})

const headcountNumber = computed(() => Number(form.headcount))

const canSubmit = computed(() => (
  hasDraft.value
  && form.addrBase.trim()
  && form.addrDetail.trim()
  && form.eventStartDate
  && form.eventEndDate
  && !dateMessage.value
  && Number.isInteger(headcountNumber.value)
  && headcountNumber.value > 0
  && !reservationCreateStore.isLoading
))

const goBackToStore = () => {
  const storeId = reservationDraftStore.store?.storeId
  router.push(storeId ? `/stores/${storeId}` : '/storelist')
}

const submitReservation = async () => {
  if (!canSubmit.value) return

  const payload = {
    storeId: reservationDraftStore.store.storeId,
    addrBase: form.addrBase.trim(),
    addrDetail: form.addrDetail.trim(),
    eventStartDate: form.eventStartDate,
    eventEndDate: form.eventEndDate,
    headcount: headcountNumber.value,
    requestMemo: form.requestMemo.trim(),
    menuIds: [...reservationDraftStore.selectedMenuIds],
  }

  try {
    const createdReservation = await reservationCreateStore.createReservation(payload)
    const reservationId = createdReservation?.reservationId

    reservationDraftStore.clearDraft()

    router.push({
      path: '/my-requests',
      query: reservationId ? { created: reservationId } : {},
    })
  } catch (error) {
    // Store state already contains the user-facing error message.
  }
}

// 상세주소 포커싱용 ref
    const addrDetailInput = ref(null)
    
    // 다음 우편번호 스크립트 동적 로드 함수
    const loadDaumPostcodeScript = () => {
      return new Promise((resolve, reject) => {
        if (window.daum && window.daum.Postcode) {
          resolve()
          return
        }
        const script = document.createElement('script')
        script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
        script.onload = () => resolve()
        script.onerror = () => reject(new Error('Daum Postcode script load failed'))
        document.head.appendChild(script)
      })
    }
    
    // 주소 검색 팝업 열기
    const openPostcode = async () => {
      try {
        await loadDaumPostcodeScript()
        new window.daum.Postcode({
          oncomplete: (data) => {
            // 도로명 주소(R)와 지번 주소 중 선택한 주소 유형에 따라 대입
            form.addrBase = data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress
            
            // 상세 주소 입력 필드로 포커스 이동
            if (addrDetailInput.value) {
              const inputEl = addrDetailInput.value.$el.querySelector('input')
              if (inputEl) {
                inputEl.focus()
              }
            }
          },
        }).open()
      } catch (error) {
        console.error('주소 API 로드 실패:', error)
        alert('주소 검색 서비스를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.')
      }
    }

</script>

<template>
  <main class="page-body">
    <div class="container container--lg reservation-create-page">
      <header class="page-header">
        <h1 class="page-header-title">견적 요청</h1>
        <p class="page-header-desc">
          행사 정보와 선택한 메뉴를 확인한 뒤 업체에 견적을 요청합니다.
        </p>
      </header>

      <section v-if="!hasDraft" class="empty-state card">
        <p>선택된 업체와 메뉴가 없습니다.</p>

        <BaseButton variant="ghost" class="mt-4" @click="router.push('/storelist')">
          업체 목록으로
        </BaseButton>
      </section>

      <section v-else class="reservation-layout">
        <aside class="card request-summary">
          <h2>요청 업체</h2>

          <div class="summary-store">
            <strong>{{ reservationDraftStore.store.businessName }}</strong>
            <span>{{ reservationDraftStore.store.businessNumber || '-' }}</span>
          </div>

          <div class="summary-block">
            <h3>선택 메뉴</h3>
            <ul class="summary-menu-list">
              <li
                v-for="menu in reservationDraftStore.selectedMenus"
                :key="menu.menuId"
              >
                <span>{{ menu.name }}</span>
                <strong>{{ Number(menu.price || 0).toLocaleString() }}원</strong>
              </li>
            </ul>
          </div>

          <BaseButton variant="ghost" full-width @click="goBackToStore">
            메뉴 다시 선택
          </BaseButton>
        </aside>

        <form class="card request-form" @submit.prevent="submitReservation">
          <div class="address-input-group">
            <BaseInput
              v-model="form.addrBase"
              label="행사 장소 기본 주소"
              placeholder="주소 검색 버튼을 클릭하여 입력해주세요."
              readonly
              class="address-base-input"
              @click="openPostcode"
            />
            <BaseButton
              type="button"
              variant="outline"
              class="address-search-btn"
              @click="openPostcode"
            >
              주소 검색
            </BaseButton>
          </div>

          <BaseInput
            ref="addrDetailInput"
            v-model="form.addrDetail"
            label="행사 장소 상세 주소"
            placeholder="예: 행사장 A동 앞"
            maxlength="100"
          />

          <div class="form-grid">
            <BaseInput
              v-model="form.eventStartDate"
              label="행사 시작 일자"
              type="date"
              :min="minEventDate"
            />

            <BaseInput
              v-model="form.eventEndDate"
              label="행사 종료 일자"
              type="date"
              :min="form.eventStartDate || minEventDate"
            />
          </div>

          <p v-if="dateMessage" class="alert alert--warning">
            {{ dateMessage }}
          </p>

          <BaseInput
            v-model="form.headcount"
            label="예상 인원"
            type="number"
            min="1"
            placeholder="예: 30"
          />

          <div class="memo-field">
            <label for="requestMemo">요청 사항</label>
            <textarea
              id="requestMemo"
              v-model="form.requestMemo"
              maxlength="1000"
              placeholder="업체에 전달할 요청 사항을 입력해 주세요."
            />
          </div>

          <p v-if="reservationCreateStore.errorMessage" class="alert alert--error">
            {{ reservationCreateStore.errorMessage }}
          </p>

          <div class="request-actions">
            <BaseButton variant="ghost" @click="router.back()">
              이전
            </BaseButton>

            <BaseButton
              type="submit"
              variant="primary"
              :disabled="!canSubmit"
            >
              {{ reservationCreateStore.isLoading ? '전송 중' : '견적 요청 전송' }}
            </BaseButton>
          </div>
        </form>
      </section>
    </div>
  </main>
</template>

<style scoped>
.reservation-create-page {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.reservation-layout {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: var(--space-6);
  align-items: start;
}

.request-summary,
.request-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.request-summary h2,
.summary-block h3 {
  color: var(--color-text);
  font-weight: 900;
}

.request-summary h2 {
  font-size: var(--text-xl);
}

.summary-block h3 {
  margin-bottom: var(--space-3);
  font-size: var(--text-md);
}

.summary-store {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  background: var(--color-bg);
}

.summary-store strong {
  color: var(--color-text);
  font-size: var(--text-lg);
}

.summary-store span {
  color: var(--color-text-muted);
  font-weight: 700;
}

.summary-menu-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin: 0;
  padding: 0;
  list-style: none;
}

.summary-menu-list li {
  display: flex;
  justify-content: space-between;
  gap: var(--space-3);
  color: var(--color-text-sub);
  font-size: var(--text-base);
}

.summary-menu-list strong {
  flex-shrink: 0;
  color: var(--color-primary);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-4);
}

.memo-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.memo-field label {
  color: var(--color-text-sub);
  font-size: var(--text-base);
  font-weight: 600;
}

.memo-field textarea {
  min-height: 140px;
  padding: 12px 14px;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-white);
  color: var(--color-text);
  resize: vertical;
}

.request-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
}

.address-input-group {
  display: flex;
  align-items: flex-end;
  gap: var(--space-2);
}

.address-base-input {
  flex: 1;
}

/* readonly 인풋 위에 마우스 올렸을 때 포인터 표시 */
.address-base-input :deep(.field-input) {
  cursor: pointer;
}

/* 인풋 높이에 맞춰 버튼 높이 및 글자 크기 지정 */
.address-search-btn {
  height: 42px;
  padding: 0 var(--space-4);
  font-size: var(--text-base);
  flex-shrink: 0;
}

@media (max-width: 900px) {
  .reservation-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .form-grid,
  .request-actions {
    grid-template-columns: 1fr;
    flex-direction: column;
  }
}
</style>
