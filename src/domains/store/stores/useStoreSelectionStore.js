import { defineStore } from "pinia";
import { ref } from "vue";

export const useStoreSelectionStore = defineStore("storeSelectionStore", () => {

  // 1. state
  const selectedStore = ref(null);
  // const selectedMenuIds = ref([]);
  
  // 2. getter

  // 3. actions
  const selectStore = (store) => {
    selectedStore.value = store;
    // selectedMenuIds.value = [];
  }

  return {
    selectedStore,

    selectStore,
  }

});