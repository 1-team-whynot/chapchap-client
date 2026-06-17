<script setup>
import ButtonComp from "./ButtonComp.vue";
import InputSearchComp from "./InputSearchComp.vue";
import {ref} from "vue";

const searchText = ref(null);

const searchIcon = '/icons/search-icon.svg';
</script>

<template>
  <div class="header-container">
    <div class="header-left-container">
      <h1 class="header-title">챱챱</h1>
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
  border-bottom: 2px solid var(--brand-white-F5F3F0-color);
  background-color: var(--brand-white-FFFFFF-color);
}

.header-left-container {
  display: flex;
  align-items: center;
  gap: 40px;
}

.header-right-container {
  display: flex;
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