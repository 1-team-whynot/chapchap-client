import axios from "axios";
import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";
import { useAuthStore } from "../../stores/auth/useAuthStore";

const myAxios = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL

  , headers: {
    'Content-Type': 'application/json'
  }

  , withCredentials: true
});

myAxios.interceptors.request.use(async (config) => {
  const authStore = useAuthStore();
  let accessToken = authStore.accessToken;
  const denyUrl = /^\/api\/reissue-token$/;

  if(!denyUrl.test(config.url) && authStore.isLoggedIn) {
    const claims = jwtDecode(accessToken);
    const now = dayjs().unix();
    const expTime = dayjs.unix(claims.exp).add(-5, 'minute').unix();

    if(now >= expTime) {
      try {
        await authStore.reissue();
        accessToken = authStore.accessToken;
      } catch (error) {
        console.error(error?.response);
      }
    }
  }
  if(accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

myAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    // 401 Unauthorized (인증 만료 또는 유효하지 않은 토큰 에러) 감지 시
    if (error.response && error.response.status === 401) {
      const authStore = useAuthStore();
      
      authStore.clearAuthStore(); // Pinia 상태 리셋
      alert('세션이 만료되었습니다. 다시 로그인해 주세요.');
      
      window.location.href = '/auth/login'; // 로그인 페이지로 리다이렉트
    }
    return Promise.reject(error);
  }
);

export default myAxios;