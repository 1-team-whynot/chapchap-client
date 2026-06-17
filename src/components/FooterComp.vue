<script setup>

</script>

<template>
  <div class="footer-container">
    <div class="footer-left-container">
      <a href="" class="footer-font">개인정보처리방침</a>
      <a href="" class="footer-font">이용약관</a>
      <a href="" class="footer-font">고객지원</a>
      <a href="" class="footer-font">FAQ</a>
      <a href="" class="footer-font">문의하기</a>
    </div>
    <div class="footer-right-container">
      <h2 class="banner">챱챱</h2>
      <div>© 2026 Chap Chap. All rights reserved.</div>
    </div>
  </div>
</template>

<style scoped>
.footer-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px 100px;
  background-color: var(--brand-white-F5F3F0-color);
}

.footer-left-container {
  display: flex;
  gap: 20px;
}

.footer-right-container {
  display: flex;
  flex-direction: column;
  text-align: right;
  gap: 10px;
}

.footer-font {
  color: var(--brand-font-color);
}

.banner {
  color: var(--brand-main-color);
}
</style>