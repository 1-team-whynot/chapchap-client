import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useChecklistStore = defineStore('checklist', () => {
  const region = ref('');
  const regionDetail = ref('');
  const date = ref('');
  const headcount = ref('');
  const selectedCategories = ref([]);
  const isPowerAvailable = ref(null);
  
  // 백엔드에 업체 목록 요청 시, 보낼 객체
  const filterParams = computed(() => {
    return{
      region: region.value,
      regionDetail: regionDetail.value,
      date: date.value,
      headcount: headcount.value,
      selectedCategories: selectedCategories.value,
      isPowerAvailable: isPowerAvailable.value
    }
  });

  return {
    region, 
    regionDetail, 
    date, 
    headcount, 
    selectedCategories, 
    isPowerAvailable,
    filterParams
  }
});

