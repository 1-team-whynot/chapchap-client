<script setup>
// App.vue는 앱의 최상위 컴포넌트예요
// 헤더, 푸터처럼 모든 페이지에 공통으로 들어갈 것들을 여기에 배치해요
// 지금은 RouterView만 있지만, 나중에 <AppHeader />, <AppFooter /> 도 여기에 추가될 거예요
</script>

<template>
  <!--
    RouterView: 현재 URL에 맞는 페이지 컴포넌트를 이 자리에 렌더링해줘요
    예를 들어 URL이 "/" 이면 HomeView가, "/trucks" 이면 TruckListView가 여기에 나타나요
    덕분에 페이지가 새로 추가되더라도 App.vue는 수정할 필요가 없어요
  -->
  <RouterView/>
</template>
