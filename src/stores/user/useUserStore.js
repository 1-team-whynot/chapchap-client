import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import myAxios from '../../domains/api/myAxios.js'
import { useAuthStore } from '../auth/useAuthStore.js'

export const useUserStore = defineStore('userStore', () => {
  // 1. State
  const myInfo = ref(null);

  // 2. Getters

  // 3. Actions
  
  // 내 정보 조회
  const selectInfo = async () => {
    try {
      const url = '/api/users/info';

      const res = await myAxios.get(url);
      const data = res.data.data;
      myInfo.value = data;
      return data;
    } catch (error) {
      throw error;
    }
  }

  // 내 정보 수정
  const updateInfo = async (updateForm) => {
    try {
      const url = '/api/users/info-update';

      const res = await myAxios.put(url, updateForm);
      const data = res.data.data;
      myInfo.value = data; // 수정 성공 시 상태 즉시 업데이트
      return data;
    } catch (error) {
      throw error;
    }
  }

  // 마이페이지 비밀번호 변경
  const changePassword = async (passwordForm) => {
    try {
      const url = '/api/users/password-change';

      const res = await myAxios.put(url, passwordForm);
      return res.data;
    } catch (error) {
      throw error;
    }
  }
  
  // 마이페이지 비밀번호 검증
  const verifyPassword = async (verifyForm) => {
    try {
      const url = '/api/users/password-verify';

      const res = await myAxios.post(url, verifyForm);
      return res.data;
    } catch (error) {
      throw error;
    }
  }

  // 회원 탈퇴
  const withdraw = async (withdrawForm) => {
    try {
      const url = '/api/users/withdraw';
      
      // DELETE 요청 시 Body에 데이터를 담을 때는 { data: payload } 형태로 보냅니다
      const res = await myAxios.delete(url, { data: withdrawForm });
      
      // 탈퇴 성공 시 내 정보 초기화 및 전역 로그아웃 처리
      myInfo.value = null;
      
      const authStore = useAuthStore();
      authStore.clearAuthStore();

      return res.data;
    } catch (error) {
      throw error;
    }
  }

  return {
    myInfo
    , selectInfo
    , updateInfo
    , changePassword
    , verifyPassword
    , withdraw
  }
});