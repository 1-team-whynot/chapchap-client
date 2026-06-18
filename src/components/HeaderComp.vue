<script setup>
import ButtonComp from "./buttons/ButtonComp.vue";
import InputSearchComp from "./inputs/InputSearchComp.vue";
import {ref} from "vue";

const searchText = ref(null);

const searchIcon = '/icons/search-icon.svg';
const logo = '/icons/sangdari-logo.png';
</script>

<template>
  <div class="header-container">
    <div class="header-left-container">
      <h1 class="header-title"></h1>
      <img :src="logo" alt="" width="120px" height="70px"/>
      <div class="nav-bar">
        <a href="" class="nav-font">트럭 찾기</a>
        <a href="" class="nav-font">내 요청</a>
        <a href="" class="nav-font">서비스 소개</a>  
      </div>
    </div>
    <div class="header-right-container">
      <InputSearchComp
        :type="'text'"
        :placeholder="'트럭 검색'"
        :readonly="false"
        required
        v-model="searchText"
      >
        <template #icon>
          <img
            :src="searchIcon"
            alt="검색"
            class="input-icon"
          />
        </template>
      </InputSearchComp>
      <ButtonComp
        :btnType="'button'"
        :size="'small'"
        :color="'white'"
        :content="'로그인'"
      />
      <ButtonComp
        :btnType="'button'"
        :size="'small'"
        :color="'orange'"
        :content="'회원가입'"
      />
    </div>
  </div>
</template>

<style scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  padding: 15px 100px;
  border-bottom: 2px solid var(--brand-gray-color);
  background-color: var(--brand-white-color);
}

.header-left-container {
  display: flex;
  align-items: center;
  gap: 40px;
}

.header-right-container {
  display: flex;
  align-items: center;
  gap: 20px;
}

.nav-bar {
  display: flex;
  gap: 15px;
}

.nav-font {
  color: var(--brand-font-color);
}

.header-title {
  color: var(--brand-main-color);
}

.input-icon {
  width: 16px;
  height: 16px;
}
</style>