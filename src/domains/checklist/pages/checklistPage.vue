<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import BaseSelect from '../components/BaseSelect.vue'
import { useChecklistStore } from '../stores/useChecklistStore.js'

const checklistStore = useChecklistStore()
const router = useRouter()

const completedCount = computed(() => {
  let count = 0

  if (checklistStore.regionId) count += 1
  if (checklistStore.isDateRangeValid) count += 1
  if (checklistStore.headcount) count += 1
  if (checklistStore.selectedCategories.length > 0) count += 1
  if (checklistStore.isPowerAvailable !== null) count += 1

  return count
})

const canSubmit = computed(() => checklistStore.isComplete)

const submitChecklist = () => {
  if (!canSubmit.value) return

  router.push({
    path: '/storelist',
    query: checklistStore.filterParams,
  })
}
</script>

<template>
  <main class="page-body">
    <div class="container container--md checklist-page">
      <header class="page-header text-center">
        <h1 class="page-header-title">행사 조건 입력</h1>
        <p class="page-header-desc">
          조건을 모두 입력하면 행사에 맞는 업체를 찾아볼 수 있습니다.
        </p>
      </header>

      <div class="progress-dots" aria-label="체크리스트 입력 진행도">
        <span
          v-for="step in 5"
          :key="step"
          :class="[
            'progress-dot',
            { 'progress-dot--active': completedCount >= step },
          ]"
        />
      </div>

      <section class="card checklist-card">
        <div class="checklist-field">
          <label class="checklist-label" for="region">행사 장소</label>
          <BaseSelect
            id="region"
            v-model="checklistStore.regionId"
            :options="checklistStore.REGIONS"
            placeholder="시/도 선택"
          />
        </div>

        <div class="checklist-grid">
          <div class="checklist-field">
            <label class="checklist-label" for="event-start-date">
              행사 시작 일자
            </label>
            <input
              id="event-start-date"
              v-model="checklistStore.eventStartDate"
              class="checklist-input"
              type="date"
              :min="checklistStore.minEventDate"
            >
          </div>

          <div class="checklist-field">
            <label class="checklist-label" for="event-end-date">
              행사 종료 일자
            </label>
            <input
              id="event-end-date"
              v-model="checklistStore.eventEndDate"
              class="checklist-input"
              type="date"
              :min="checklistStore.eventStartDate || checklistStore.minEventDate"
            >
          </div>
        </div>

        <p v-if="checklistStore.dateMessage" class="alert alert--warning">
          {{ checklistStore.dateMessage }}
        </p>

        <div class="checklist-field">
          <p class="checklist-label">예상 인원</p>
          <div class="button-group">
            <button
              v-for="option in checklistStore.HEADCOUNT_OPTIONS"
              :key="option.value"
              type="button"
              :class="[
                'choice-button',
                { 'choice-button--active': checklistStore.headcount === option.value },
              ]"
              @click="checklistStore.headcount = option.value"
            >
              {{ option.label }}
            </button>
          </div>
        </div>

        <div class="checklist-field">
          <p class="checklist-label">
            메뉴 카테고리
            <span class="checklist-label-sub">중복 선택 가능</span>
          </p>
          <div class="button-group">
            <button
              v-for="category in checklistStore.MENU_CATEGORIES"
              :key="category"
              type="button"
              :class="[
                'choice-button',
                {
                  'choice-button--active':
                    checklistStore.selectedCategories.includes(category),
                },
              ]"
              @click="checklistStore.toggleCategory(category)"
            >
              {{ category }}
            </button>
          </div>
        </div>

        <div class="checklist-field">
          <p class="checklist-label">전기 사용 여부</p>
          <div class="button-group button-group--two">
            <button
              type="button"
              :class="[
                'choice-button',
                { 'choice-button--active': checklistStore.isPowerAvailable === true },
              ]"
              @click="checklistStore.isPowerAvailable = true"
            >
              사용 가능
            </button>
            <button
              type="button"
              :class="[
                'choice-button',
                { 'choice-button--active': checklistStore.isPowerAvailable === false },
              ]"
              @click="checklistStore.isPowerAvailable = false"
            >
              사용 불가
            </button>
          </div>
        </div>

        <button
          class="submit-button"
          type="button"
          :disabled="!canSubmit"
          @click="submitChecklist"
        >
          조건에 맞는 업체 보기
        </button>
      </section>
    </div>
  </main>
</template>

<style scoped>
.checklist-page {
  max-width: 760px;
}

.checklist-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.progress-dots {
  display: flex;
  justify-content: center;
  gap: var(--space-2);
  margin-bottom: var(--space-8);
}

.progress-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--color-border);
  transition: background var(--transition-fast);
}

.progress-dot--active {
  background: var(--color-primary);
}

.checklist-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-4);
}

.checklist-field {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.checklist-label {
  color: var(--color-text);
  font-size: var(--text-md);
  font-weight: 800;
}

.checklist-label-sub {
  margin-left: var(--space-2);
  color: var(--color-text-muted);
  font-size: var(--text-sm);
  font-weight: 600;
}

.checklist-input {
  width: 100%;
  padding: 12px 14px;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-white);
  color: var(--color-text);
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.button-group--two .choice-button {
  flex: 1;
}

.choice-button,
.submit-button {
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-white);
  color: var(--color-text-sub);
  font-weight: 800;
  transition:
    background var(--transition-fast),
    border-color var(--transition-fast),
    color var(--transition-fast);
}

.choice-button {
  padding: 10px 18px;
  font-size: var(--text-base);
}

.choice-button--active {
  border-color: var(--color-primary);
  background: #fff7ed;
  color: var(--color-primary);
}

.submit-button {
  width: 100%;
  padding: 14px 20px;
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-white);
  font-size: var(--text-md);
}

.submit-button:hover:not(:disabled) {
  background: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
}

.submit-button:disabled {
  background: var(--color-border);
  border-color: var(--color-border);
  color: var(--color-text-muted);
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .checklist-grid {
    grid-template-columns: 1fr;
  }

  .button-group--two .choice-button {
    flex-basis: 100%;
  }
}
</style>
