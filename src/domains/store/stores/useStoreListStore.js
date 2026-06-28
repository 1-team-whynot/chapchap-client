import axios from "axios";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useStoreListStore = defineStore("storeListStore", () => {

  // 1. state
  const filterStores = ref([]);
  const isLastPage = ref(false);
  const totalItems = ref(0);
  const currentPage = ref(1);

  const limit = 10;

  // 페이지네이션에서 한 번에 보여줄 버튼 개수
  const paginationBtnLimit = 5;

  // --------------------------------------------------------------------------
  
  // 2. getter
  // 총 페이지 수
  const totalPages = computed(() => {
    return Math.ceil(totalItems.value / limit);
  });
  
  // 페이지네이션, 화면에서 보여줄 페이지( ex.[4, 5, 6, 7, 8])
  const pageRange = computed(() => {
    const total = totalPages.value;
    const current = currentPage.value;
    const count = paginationBtnLimit;
    
    let start = current - Math.floor(count / 2);
    if (start < 1) start = 1;
    
    let end = start + count - 1;
    if (end > total) {
      end = total;
      start = end - count + 1;
      if (start < 1) start = 1;
    }
    
    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  });
  
  // ------------------------------------------------------------------------------

  // 3. actions
  // "업체 목록"에서 출력할 업체 리스트
  // (체크리스트에서 선택한 조건, 페이지, 리미트 전달)
  const getMatchingStores = async (filterParams) => {

    if(!isLastPage.value) {
      try {
        const url = '/api/stores';
        const params = {
          ...filterParams,
          page: currentPage.value,
          limit
        };

        const res = await axios.get(url, {
          params,
           // 배열을 변환할 때 뒤에 대괄호([])나 인덱스 번호([0], [1]) 같은 거 붙이지 말고,
           // 순수한 key 이름만 반복해서 표현해 줘!"
          paramsSerializer: {
            indexes: null 
          }
        });
        const data = res.data?.data;
        const stores = data?.stores;
        console.log(stores);

        // 데이터가 배열인지 확인 후 push
        if (Array.isArray(stores)) {
          filterStores.value.push(...stores);
        } else {
          console.warn("데이터 형식이 올바르지 않거나 stores가 비어있습니다:", data);
        }

        isLastPage.value = data.isLastPage;
        totalItems.value = data.totalItems;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
  };

  // 업체 목록: 가존 데이터 삭제
  const clearPage = () => {
    filterStores.value = [];
    isLastPage.value = false;
    currentPage.value = 1;
  };

  // 업체 목록: 페이지 변경하기
  const changePage = async (page, filterParams) => {

    try {
      clearPage();

      // 범위를 벗어난 페이지 요청 차단   
      if (page < 1 || page > totalPages.value) return;

      currentPage.value = page;
      await getMatchingStores(filterParams);

    } catch (error) {
      console.error(error);
      alert("페이지를 불러오지 못했습니다.");
    }
  };

  return {
    filterStores,
    isLastPage,
    totalItems,
    currentPage,
    limit,
    paginationBtnLimit,

    totalPages,
    pageRange,

    getMatchingStores,
    clearPage,
    changePage,
  }

});