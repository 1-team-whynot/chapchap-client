<script setup>
import HeaderComp from "./components/HeaderComp.vue";
import FooterComp from "./components/FooterComp.vue";
</script>

<template>
  <div class="container">
    <HeaderComp/>
    <router-view class="main-content"></router-view>
    <FooterComp/>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* 최소 화면 전체 높이만큼 확보 */
}

/* 3. 메인 콘텐츠가 남는 공간을 모두 채우도록 설정 */
.main-content {
  flex: 1; 
  /* 콘텐츠가 적어도 푸터를 아래로 밀어내고, 
     콘텐츠가 많아지면 자연스럽게 스크롤이 생깁니다. */
}
</style>