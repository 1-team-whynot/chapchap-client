import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import myAxios from '../../domains/api/myAxios.js'

export const useAuthStore = defineStore('authStore', () => {
  // 1. State
  const userInfo = ref(null);
  const isLoggedIn = ref(false);
  const accessToken = ref('');

  // 2. Getters

  // 3. Actions
  const clearAuthStore = () => {
    userInfo.value = null;
    accessToken.value = '';
    isLoggedIn.value = false;
  }

  const login = async (loginForm) => {
    try {
      const url = '/api/auth/login';

      const res = await myAxios.post(url, loginForm);
      const data = res.data.data;
      accessToken.value = data.accessToken;
      userInfo.value = data.userResponse;
      isLoggedIn.value = true;
    } catch (error) {
      throw error;
    }
  }

  const reissue = async () => {
    try {
      const url = '/api/reissue-token';

      const res = await myAxios.post(url);
      const data = res.data.data;
      accessToken.value = data.accessToken;
      userInfo.value = data.userResponse;
      isLoggedIn.value = true;
    } catch (error) {
      clearAuthStore();
    }
  }

  const signup = async (signupForm) => {
    try {
      const url = '/api/users/signup';
      
      const res = await myAxios.post(url, signupForm);
      const data = res.data;
      return true;
      
    } catch (error) {
      console.log(error)
      throw error;
    }
  }

  const checkEmail = async (email) => {
    try {
      const url = '/api/email-check';
      
      const res = await myAxios.get(url, {params:{email}});

      return res.data.data;
    } catch (error) {
      throw error;
    }
  }

  return {
    userInfo
    , accessToken
    , isLoggedIn
    , login 
    , reissue
    , signup
    , checkEmail
  }
});