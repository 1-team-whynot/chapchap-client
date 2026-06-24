<script setup>
import { computed, ref } from 'vue';
import BaseSelect from './BaseSelect.vue';

// 체크된 항목 표시
const options = ref([
  {id: 1, optionName: '행사 장소', checked: false },
  {id: 2, optionName: '행사 일정', checked: true },
  {id: 3, optionName: '인원 수', checked: false },
  {id: 4, optionName: '메뉴 카테고리', checked: false },
  {id: 5, optionName: '전기 사용', checked: false },
]);

// 1. 행사 지역
const region = ref('');

const REGIONS = [
  {regionId: 1, name: '서울'},
  {regionId: 2, name: '경기'}
];

// 2. 행사 날짜
  // minDate => 오늘로부터 14일 이후 일자. String
const date = ref('');

const today = new Date();
const minDateObj = new Date();
minDateObj.setDate(today.getDate() + 14);
const minDate = minDateObj.toISOString().split('T')[0];

// 2-1. 행사 날짜 14일 이내일 시 true(경고문) 출력
const isDateTooSoon = computed(() => {
  if(!date.value) return false

  return new Date(date.value) < new Date(minDate)
});

// 3. 예상 인원
// TODO: 여기 인원수 구간 배열 넣기
const HEADCOUNT = ref([

])
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

  <!-- 체크된 항목 표시 -->
  <div class="checked-list">
    <div 
    class="checked-option"
    v-for="option in options"
    :key="option.id"
    >
      <!-- option.checked === true → {checked: true} -->
      <div 
      class="circle"
      :class="{checked: option.checked}"
      ></div>
    </div>
  </div>

  <!-- 선택 폼 -->
  <div class="checklist-card">
  
    <!-- 1. 행사 지역 -->
    <div class="checklist-box">
      <span class="checklist-title">행사 지역</span>
      <div class="checklist-option">
        <BaseSelect
          class="checklist-option-flex1" 
          v-model="region"
          :options="REGIONS"
          placeholder="시/도 선택"
        />
    
        <input 
          class="checklist-option-flex3 checklist-style" 
          name="regionDetail" 
          placeholder="상세 주소(선택)"
        ></input>
      </div>
    </div>    

    <!-- 2. 행사 날짜 -->
    <div class="checklist-box">
      <span class="checklist-title">행사 날짜</span>
      <div class="checklist-option">
        <input 
          class="checklist-style"
          type="date"
          v-model="date"
          :min="minDate"
        >
      </div>
      <p v-if="isDateTooSoon" class="checklist-warning">
        : 최소 14일 후 날짜를 선택해주세요.
      </p>
    </div>

    <!-- 3. 예상 인원 -->
     <!-- TODO: 인원수 구간 DB 구조 변경? 이넘? 이넘으로 한다면 규칙은? -->
  <div class="checklist-box">
    <span class="checklist-title">예상 인원</span>
    <div class="checklist-option">
      <button
        v-for="option in HEADCOUNT"
        :key="option.value"
      ></button>
    </div>
  </div>
  </div>
</div>

</template>

<style scoped>
.main {
  width: 760px;
  margin: 0 auto;
  padding: 0 50px;
}

.page-title {
  padding-top: 30px;
  text-align: center;
}

.checked-list {
  padding: 16px 24px;
  display: flex;
  gap: 10px;
  justify-content: center;
}

.circle {
  width: 10px;
  height: 10px;
  background-color: gray;
  border-color: gray;
  border-radius: 20px;
}

.circle.checked {
  background-color: orange;
  border-color: orange;
}

/* ----------------------------- 채크리스트 카드 ---------------------------------- */
.checklist-card {
  border: 1px solid gray;
  border-radius: 30px;
  padding: 30px;
}

.checklist-box {
  position: relative;
}

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