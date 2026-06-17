<script setup>
import FooterComp from '../components/FooterComp.vue';
import HeaderComp from '../components/HeaderComp.vue';
import InputBasicComp from '../components/InputBasicComp.vue';

</script>

<template>
  <HeaderComp />
  <div class="form-container">
    <h1>회원가입</h1>
    <form>
      <div
        class="input-container"
        v-for="val in source"
      >
        <InputBasicComp
          :type="'email'"
          :placeholder="'이메일을 입력해주세요.'"
          :readonly="false"
          :required="true"
        ></InputBasicComp>
      </div>
    </form>
  </div>
  <FooterComp />
</template>

<style scoped>

</style>