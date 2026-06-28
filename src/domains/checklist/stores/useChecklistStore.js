import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useChecklistStore = defineStore('checklist', () => {

  // 체크리스트 "3. 예상 인원"의 인원수 옵션
  const HEADCOUNT = ref([
    { label: '30명 이하', value: '30명 이하', min: 0, max: 30 },
    { label: '31~100명', value: '31~100명', min: 31, max: 100 },
    { label: '101~200명', value: '101~200명', min: 101, max: 200 },
    { label: '201~300명', value: '201~300명', min: 201, max: 300 },
    { label: '300명 초과', value: '300명 초과', min: 301, max: 9999 },
  ]);

  // --------------------------------------------------------------------------------
  // 체크리스트에서 선택한 조건
  const region = ref(null);
  const regionDetail = ref('');
  const date = ref('');
  const headcount = ref('');
  const selectedCategories = ref([]);
  const isPowerAvailable = ref(null);
  
  
  // --------------------------------------------------------------------------------
  // 백엔드에 업체 목록 요청 시, param 값으로 보낼 객체
  const filterParams = computed(() => {
    
    // headcount에서 min&max 값(숫자) 각각 추출하기
    let minHeadcount = null;
    let maxHeadcount = null;
    
    if(headcount.value) {
      const selectedItem = HEADCOUNT.value.find(item => item.value === headcount.value);
      if (selectedItem) {
        minHeadcount = selectedItem.min;
        maxHeadcount = selectedItem.max;
      }
    }
    
    // param의 집합
    return{
      regionId: region.value,
      regionDetail: regionDetail.value,
      date: date.value,
      minHeadcount: minHeadcount,
      maxHeadcount: maxHeadcount,
      selectedCategories: selectedCategories.value,
      isPowerAvailable: isPowerAvailable.value
    }
  });

  return {
    HEADCOUNT,
    region, 
    regionDetail, 
    date, 
    headcount, 
    selectedCategories, 
    isPowerAvailable,
    filterParams
  }
});