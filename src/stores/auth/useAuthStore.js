import { defineStore } from "pinia";
import { ref } from "vue";
import myAxios from "../../api/myAxios";

export const useAuthStore = defineStore('authStore', () => {
  // 1. State
  const isLoggedIn = ref(false);
  const accessToken = ref('');
  const userInfo = ref(null);
  
  // 2. Getters

  // 3. Actions
  const registration = async (data) => {
    try {
      const url = '/api/registration/select';

      await myAxios.post(url, data);
      return true;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  const reissue = async () => {
    try {
      const url = '/api/reissue-token';

      const res = await myAxios.post(url);
      const data = res.data.data;
      accessToken.value = data.accessToken;
      userInfo.value = data.user;
      isLoggedIn.value = true;
    } catch (error) {
      clearAuthStore();
      // throw error;
      // useMyErrorStore().setErrorInfo(error);
    }
  }

  return {
    // State
    isLoggedIn
    , accessToken
    , userInfo
    
    // Getters
    
    // Actions
    , reissue
    , registration
  }
})