// 전역 CSS 파일을 불러옵니다 (브랜드 색상 변수 등이 여기 정의되어 있어요)
import './style.css'

// Vue 앱을 만드는 핵심 함수
import { createApp } from 'vue'

// Pinia: Vue 전용 전역 상태관리 라이브러리예요
// 여러 컴포넌트에서 공통으로 쓰는 데이터(예: 로그인 정보)를 한 곳에서 관리할 때 사용해요
import { createPinia } from 'pinia'

// 우리가 만든 라우터 설정 파일을 불러옵니다 (페이지 경로 관리)
import router from './routes/router'

// 앱의 최상위 컴포넌트 (모든 페이지의 껍데기 역할)
import App from './App.vue'

// Vue 앱을 생성하고 필요한 플러그인들을 연결한 뒤 #app 요소에 마운트해요
// index.html에 <div id="app"></div> 가 있고, 거기에 Vue 앱이 붙는 방식이에요
createApp(App)
  .use(router)      // 라우터 연결: URL에 따라 다른 페이지를 보여주는 기능
  .use(createPinia()) // Pinia 연결: 전역 상태관리 기능
  .mount('#app');   // 실제 HTML의 #app 요소에 Vue 앱을 붙임


