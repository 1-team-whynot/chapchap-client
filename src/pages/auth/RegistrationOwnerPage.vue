<script setup>
import { reactive } from 'vue';
import ButtonComp from '../../components/buttons/ButtonComp.vue';
import InputBasicComp from '../../components/inputs/InputBasicComp.vue';
import registrationValidator from '../../validators/auth/registrationValidator.js';

const registrationData = reactive({
  email: ''
  , password: ''
  , passwordChk: ''
  , name: ''
  , phone: ''
  , businessName: ''
  , businessNum: ''
});

const handleSubmit = () => {
  // 유효성 검사
  const validationList = [
    registrationValidator.email(registrationData.email)
    , registrationValidator.password(registrationData.password)
    , registrationValidator.passwordChk(registrationData.password, registrationData.passwordChk)
    , registrationValidator.name(registrationData.name)
    , registrationValidator.phone(registrationData.phone)
    , registrationValidator.businessName(registrationData.businessName)
    , registrationValidator.businessNum(registrationData.businessNum)
  ];

  const errorList = validationList.filter(val => val);

  if(errorList.length > 0) {
    alert(errorList.join('\n'));
    return;
  }
}
</script>

<template>
  <div class="form-container">
    <h1><span>파트너</span> 회원</h1>
    <form @submit.prevent="handleSubmit">
      <p>*필수 항목입니다.</p>
      <div class="input-container">
        <label for="email">이메일</label>
        <div class="email-wrap">
          <InputBasicComp
            id="email"
            :type="'email'"
            :placeholder="'이메일을 입력해주세요.'"
            :readonly="false"
            :required="true"
            :borderColor="'pink'"
            style="flex: 1;"
            v-model="registrationData.email"
          ></InputBasicComp>
          <ButtonComp
            :content="'중복 확인'"
            :color="'pink'"
            style="padding: 10px 15px;"
          ></ButtonComp>
        </div>
      </div>

      <div class="input-container">
        <label for="password">비밀번호</label>
        <InputBasicComp
          id="password"
          :type="'password'"
          :placeholder="'비밀번호를 입력해주세요.'"
          :readonly="false"
          :required="true"
          :borderColor="'pink'"
          v-model="registrationData.password"
        ></InputBasicComp>
      </div>

      <div class="input-container">
        <label for="passwordChk">비밀번호 확인</label>
        <InputBasicComp
          id="passwordChk"
          :type="'password'"
          :placeholder="'비밀번호를 한 번 더 입력해주세요.'"
          :readonly="false"
          :required="true"
          :borderColor="'pink'"
          v-model="registrationData.passwordChk"
        ></InputBasicComp>
      </div>

      <div class="input-container">
        <label for="name">성함</label>
        <InputBasicComp
          id="name"
          :placeholder="'성함을 입력해주세요.'"
          :readonly="false"
          :required="true"
          :borderColor="'pink'"
          v-model="registrationData.name"
        ></InputBasicComp>
      </div>

      <div class="input-container">
        <label for="phone">연락처</label>
        <InputBasicComp
          id="phone"
          :type="'tell'"
          :placeholder="'하이픈(-) 없이 숫자만 입력해주세요.'"
          :readonly="false"
          :required="true"
          :borderColor="'pink'"
          v-model="registrationData.phone"
        ></InputBasicComp>
      </div>

      <div class="input-container">
        <label for="businessName">상호명</label>
        <InputBasicComp
          id="businessName"
          :placeholder="'상호명을 입력해주세요.'"
          :readonly="false"
          :required="true"
          :borderColor="'pink'"
          v-model="registrationData.businessName"
        ></InputBasicComp>
      </div>

      <div class="input-container">
        <label for="businessNumber">사업자 번호</label>
        <InputBasicComp
          id="businessNumber"
          :placeholder="'하이픈(-) 없이 숫자만 입력해주세요.'"
          :readonly="false"
          :required="true"
          :borderColor="'pink'"
          v-model="registrationData.businessNum"
        ></InputBasicComp>
      </div>

      <div class="input-container">
        <label for="region">활동 지역</label>
        <InputBasicComp
          id="region"
          :placeholder="'대구 / 경북'"
          disabled
        ></InputBasicComp>
      </div>

      <div class="input-container input-file">
        <label for="storeImg">가게 사진</label>
        <label for="storeImg" class="custom">첨부</label>
        <input id="storeImg" type=file />
      </div>

      <ButtonComp
        :type="'submit'"
        :content="'회 원 가 입'"
        :color="'pink'"
        style="padding: 10px 15px;"
      ></ButtonComp>
    </form>
  </div>
</template>

<style scoped>
.form-container {
  padding: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 50px;
  color: var(--brand-font-color);
}

h1 {
  letter-spacing: 10%;
}

p {
  align-self: flex-end;
  font-size: 10px;
  color: var(--brand-point-color);
}

span {
  color: var(--brand-point-color);
}

form {
  min-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.input-container {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

label:not([class="custom"])::before {
  content: '*';
  color: var(--brand-point-color);
}

.email-wrap {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.input-file {
  flex-direction: row;
  align-items: center;
  gap: 20px;
  padding-bottom: 20px;
}

.input-file label:nth-of-type(2) {
  padding: 6px 10px;
  font-size: 14px;
  color: var(--brand-white-color);
  border-radius: 7px;
  background-color: var(--brand-point-color);
}

.input-file input {
  display: none;
}
</style>