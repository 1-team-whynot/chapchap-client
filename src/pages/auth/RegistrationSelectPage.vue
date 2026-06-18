<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goToSignup = (type) => {
  if (type === 'users') {
    router.replace('/users/registration');
  } else if (type === 'owners') {
    router.replace('/owners/registration');
  }
}
</script>

<template>
  <div class="registration-select-container">
    <h1>회원가입</h1>
    <p>회원 유형을 선택해주세요.</p>
    <div class="select-wrap">
      <div
        class="select-btn" style="background-color: var(--brand-main-color);"
        @click="goToSignup('users')"
      >
        <div class="icon-wrap"><div class="icon" style="background-image: url(/icons/userIcon.svg);"></div></div>
        <p>일반 회원</p>
      </div>
      <div
        class="select-btn" style="background-color: var(--brand-point-color);"
        @click="goToSignup('owners')"
      >
        <div class="icon-wrap"><div class="icon" style="background-image: url(/icons/ownerIcon.svg); height: 22px;"></div></div>
        <p>파트너 회원</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.registration-select-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 30px;
  color: var(--brand-font-color);
}

.select-wrap {
  height: 300px;
  display: grid;
  grid-template-columns: repeat(2, minmax(285px, 1fr));
  gap: 30px;
}

.select-btn {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 30px;
  border-radius: 30px;
  font-weight: 700;
  color: var(--brand-white-color);
  cursor: pointer;
}

.icon-wrap {
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 30px;
  background-color: var(--brand-white-color);
}

.icon {
  width: 30px;
  height: 30px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
</style>