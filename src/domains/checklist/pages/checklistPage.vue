<script setup>
import { computed, ref } from 'vue';
import BaseSelect from '../components/BaseSelect.vue';
import { useChecklistStore } from '../stores/useChecklistStore.js';
import { useRouter } from 'vue-router';

const checklistStore = useChecklistStore();
const router = useRouter();

// 체크된 항목 표시
const completedCount = computed(() => {
  let count = 0;
  if(checklistStore.region)                                 count++;
  if(checklistStore.date && checklistStore.date >= minDate) count++;
  if(checklistStore.headcount)                              count++;
  if(checklistStore.selectedCategories.length > 0)          count++;
  if(checklistStore.isPowerAvailable != null)      count++;
  return count;
})

// --------------------- 선택 폼 ---------------------------------------
// 1. 행사 지역
const REGIONS = [
  {regionId: 1, name: '서울'},
  {regionId: 2, name: '경기'},
  {regionId: 3, name: '인천'},
  {regionId: 4, name: '강원'},
  {regionId: 5, name: '대전'}
];

// 2. 행사 날짜
  // minDate => 오늘로부터 14일 이후 일자. String
const today = new Date();
const minDateObj = new Date();
minDateObj.setDate(today.getDate() + 14);
const minDate = minDateObj.toISOString().split('T')[0];

// 2-1. 행사 날짜 14일 이내일 시 true(경고문) 출력
const isDateTooSoon = computed(() => {
  if(!checklistStore.date) return false

  return new Date(checklistStore.date) < new Date(minDate)
});

// 4. 음식 종류
const MENUCATEGORIES = ['분식', '도시락/덮밥', '바비큐/스테이크', '카페/디저트', '타코/멕시칸', '닭강정/꼬치', '기타'];

// 4-1. 음식 종류: 버튼 클릭 이벤트
const toggleCategory = (category) => {
  const index = checklistStore.selectedCategories.indexOf(category);
  if (index === -1) {
    // 아직 선택 안 됨 => 추가
    checklistStore.selectedCategories.push(category);
  } else {
    // 이미 선택됨 => 제거
    checklistStore.selectedCategories.splice(index, 1);
  }
}

// ----------------------------------------------------------------------------------
// 제출 버튼
  // 5개 항목 모두 선택하면 제출 버튼 활성화
const canSubmit = computed(() => {
  return completedCount.value === 5;
});

  // 업체 목록 페이지로 이동
const submitChecklist = () => {
 if (!canSubmit.value) return;
 router.push('/storelist');
};

</script>

<template>
<h1 style="text-align: center;">헤더</h1>
<hr>

  <div class="main">

    <!-- 페이지 제목 -->
    <div class="page-title">
      <h1>행사 조건 입력</h1>
      <span>조건을 모두 입력하면 맞춤 트럭을 추천해드려요.</span>
    </div>

    <!-- 체크된 항목 표시(도트) -->
    <div class="checked-dots">
      <div 
        v-for="i in 5"
        :key="i"
        :class="['dot', {'dot-checked': completedCount >= i}]"
      ></div>
    </div>

    <!-- 선택 폼 -->
    <div class="checklist-card"> 
    
      <!-- 1. 행사 지역 -->
      <div class="checklist-box">
        <p class="checklist-title">행사 지역</p>
        <div class="checklist-option">
          <BaseSelect
            class="checklist-option-flex1" 
            v-model="checklistStore.region"
            :options="REGIONS"
            placeholder="시/도 선택"
          />
      
          <!-- <input 
            class="checklist-option-flex3 checklist-style" 
            v-model="checklistStore.regionDetail" 
            placeholder="상세 주소(선택)"
          ></input> -->
        </div>
      </div>    

      <!-- 2. 행사 날짜 -->
      <div class="checklist-box">
        <p class="checklist-title">행사 날짜</p>
        <div class="checklist-option">
          <input 
            class="checklist-style"
            type="date"
            v-model="checklistStore.date"
            :min="minDate"
          >
        </div>
        <p v-if="isDateTooSoon" class="checklist-warning">
          : 최소 14일 후 날짜를 선택해주세요.
        </p>
      </div>

      <!-- 3. 예상 인원 -->
    <div class="checklist-box">
      <p class="checklist-title">예상 인원</p>
      <div class="checklist-btn-option">
        <button
          v-for="option in checklistStore.HEADCOUNT"
          :key="option.value"
          :class="['checklist-btn', {'checklist-btn-active': checklistStore.headcount === option.value}]"
          @click="checklistStore.headcount = option.value"
        >
          {{ option.label }}
        </button>
      </div>
    </div>

    <!-- 4. 음식 종류 -->
    <div class="checklist-box">
      <p class="checklist-title">
        음식 종류
        <span class="checklist-sub">(중복 선택)</span>
      </p>
      <div class="checklist-btn-option">
        <button
          v-for="category in MENUCATEGORIES"
          :key="category"
          :class="['checklist-btn', {'checklist-btn-active': checklistStore.selectedCategories.includes(category) }]"
          @click="toggleCategory(category)"
        >
        {{ category }}
        </button>
      </div>
    </div>

    <!-- 5. 전기 사용 여부 -->
    <div class="checklist-box">
      <p class="checklist-title">전기 사용 여부</p>
      <div class="checklist-btn-option">
        <button
            :class="['checklist-btn', 'checklist-option-flex1', {'checklist-btn-active': checklistStore.isPowerAvailable === false }]"
            @click="checklistStore.isPowerAvailable = false"
        >
          가능
        </button>
        <button
            :class="['checklist-btn', 'checklist-option-flex1', {'checklist-btn-active': checklistStore.isPowerAvailable === true }]"
            @click="checklistStore.isPowerAvailable = true"
        >
          불가
        </button>
      </div>
    </div>

    <!-- 제출 버튼 -->
    <!-- TODO: 버튼 공용 컴포넌트 적용시키기, 색상 효과 확인 -->
    <!-- :class="['checklist-btn', 'checklist-option-flex1', {'checklist-btn-active': }]" -->
    <button
      :class="'checklist-btn'"
      :disabled="!canSubmit"
      @click="submitChecklist"
    >
      맞춤 트럭 보기 → 
    </button>
    </div>
  </div>

</template>

<style scoped>
.main {
  width: 730px;
  margin: 0 auto;
  margin-bottom: 50px;
  padding: 0 50px;
}

.page-title {
  padding-top: 30px;
  text-align: center;
}

/* ------------------------ 체크한 항목 개수 표시 동그라미 --------------------------- */
.checked-dots {
  padding: 16px 24px;
  display: flex;
  gap: 10px;
  justify-content: center;
}

.dot {
  width: 10px;
  height: 10px;
  background-color: gray;
  border-color: gray;
  border-radius: 20px;
}

.dot-checked {
  background-color: orange;
  border-color: orange;
}

/* ----------------------------- 체크리스트 카드 ---------------------------------- */
.checklist-card {
  border: 1px solid gray;
  border-radius: 30px;
  padding: 30px;

  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.checklist-box {
   display: flex;
  flex-direction: column;
  gap: 10px;

  position: relative;
}

.checklist-title {
  padding: 5px;

  font-size: var(--text-md);
  font-weight: 700;
  color: var(--color-text);
}

.checklist-sub {
  font-size: var(--text-sm);
  font-weight: 400;
  color: var(--color-text-placeholder);
}
/* ------------------- 1, 2번 항목 스타일 -------------------- */
.checklist-option {
  margin-top: 5px;
  display: flex;
  gap: 10px;
  justify-content: space-between;
}

.checklist-option-flex1 {
  flex: 1;
}
.checklist-option-flex3 {
  flex: 3;
}

/* ------------------ 3, 4, 5번 항목 스타일 ---------------------- */
.checklist-btn-option {
  padding: 5px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.checklist-btn {
  padding: 10px 30px;
  color: black;
  background-color: white;
  border: 1px solid gray;
  border-radius: 10px;
  cursor: pointer;
}
.checklist-btn-active {
  border-color: orange;
  background: #ffe2acb4;
  color: black;
}

.checklist-style {
  width: 100%;
  padding: 10px;
  color: black;
  border: 1px solid gray;
  border-radius: 10px;
}

.checklist-warning {
  position: absolute;
  top: 30px;
  left: 100px;

  padding: 5px;
  color: red;
  background-color: white;
}
</style>