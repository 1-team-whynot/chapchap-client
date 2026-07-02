<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../../stores/auth/useAuthStore';
import { useErrorStore } from '../../../stores/error/useErrorStore';
import { email, name, password, passwordChk, phone } from '../../user/rule/userRule';
import signupValidator from '../utils/signupValidator';
import AuthInputComponent from '../components/AuthInputComponent.vue';
import BaseButton from '../../common/components/BaseButton.vue';
import { computed, reactive, ref, watch } from 'vue';

const router = useRouter();
const authStore = useAuthStore();
const errorStore = useErrorStore();

const isLoading = ref(false);
const errorMessage = ref('');

const signupForm = reactive({
  email: ''
  , password: ''
  , passwordChk: ''
  , name: ''
  , phone: ''
});

// 모든 필수 입력창에 내용이 들어왔는지 확인하는 computed 변수
const isFormComplete = computed(() => {
  return (
    signupForm.email.trim() !== '' &&
    signupForm.password.trim() !== '' &&
    signupForm.passwordChk.trim() !== '' &&
    signupForm.name.trim() !== '' &&
    signupForm.phone.trim() !== ''
  )
});

const emailError = ref('');
const passwordError = ref('');
const passwordChkError = ref('');
const nameError = ref('');
const phoneError = ref('');
const isEmailChecked = ref(false);
const isCheckingEmail = ref(false);

// 이메일 실시간 검사
watch(() => signupForm.email, (newVal) => {
  isEmailChecked.value = false;
  if (!newVal) {
    emailError.value = '';
  } else {
    emailError.value = signupValidator.email(newVal);
  }
});

// 비밀번호 실시간 검사
watch(() => signupForm.password, (newVal) => {
  if (!newVal) {
    passwordError.value = '';
  } else {
    passwordError.value = signupValidator.password(newVal);
  }
  if (signupForm.passwordChk) {
    passwordChkError.value = signupValidator.passwordChk(newVal, signupForm.passwordChk);
  }
});

// 비밀번호 확인 실시간 검사
watch(() => signupForm.passwordChk, (newVal) => {
  if (!newVal) {
    passwordChkError.value = '';
  } else {
    passwordChkError.value = signupValidator.passwordChk(signupForm.password, newVal);
  }
});

// 이름 실시간 검사
watch(() => signupForm.name, (newVal) => {
  if (!newVal) {
    nameError.value = '';
  } else {
    nameError.value = signupValidator.name(newVal);
  }
});

// 연락처 실시간 검사
watch(() => signupForm.phone, (newVal) => {
  if (!newVal) {
    phoneError.value = '';
  } else {
    phoneError.value = signupValidator.phone(newVal);
  }
});

const handleCheckDuplicateEmail = async () => {
  emailError.value = ''
  isEmailChecked.value = false

  const emailValError = signupValidator.email(signupForm.email)
  if (emailValError) {
    emailError.value = emailValError
    return
  }

  isCheckingEmail.value = true
  try {
    const isDuplicated = await authStore.checkEmail(signupForm.email)
    
    if (!isDuplicated) {
      emailError.value = '이미 사용 중인 이메일입니다.'
    } else {
      alert('사용 가능한 이메일입니다! ✨')
      isEmailChecked.value = true
    }
  } catch (error) {
    emailError.value = '이메일 중복 확인 중 에러가 발생했습니다.'
  } finally {
    isCheckingEmail.value = false
  }
}

const handleSubmit = async () => {
  if (!isEmailChecked.value) {
    alert('이메일 중복 확인을 먼저 완료해 주세요.')
    return
  }

  // 최종 제출 전 전체 유효성 검사 갱신
  emailError.value = signupValidator.email(signupForm.email);
  passwordError.value = signupValidator.password(signupForm.password);
  passwordChkError.value = signupValidator.passwordChk(signupForm.password, signupForm.passwordChk);
  nameError.value = signupValidator.name(signupForm.name);
  phoneError.value = signupValidator.phone(signupForm.phone);

  const errorList = [
    emailError.value,
    passwordError.value,
    passwordChkError.value,
    nameError.value,
    phoneError.value
  ].filter(val => val);

  if(errorList.length > 0) {
    return;
  }

  isLoading.value = true
  try {
    await authStore.signup(signupForm);
    alert('회원가입이 완료되었습니다!')
    router.replace('/auth/login')
  } catch (error) {
    const data = error.response?.data;
    if(data) {
      if(data.code === 'E30' && data.message === 'USER_PHONE_DUPLICATED') {
        phoneError.value = data.data || '이미 가입된 번호입니다.';
      } else if(data.code === 'E30' && data.message === 'USER_EMAIL_DUPLICATED') {
        emailError.value = data.data || '이미 가입된 이메일입니다.';
      } else if(data.code === 'E11') {
        alert(data.data);
      } else if(data.code === 'E21') {
        alert('잘못된 양식입니다.')
      } else {
        errorStore.setErrorInfo(error);
        alert(data.message || '회원가입 도중 에러가 발생했습니다.');
      }
    } else {
      errorStore.setErrorInfo(error);
      alert('서버와의 연결이 원활하지 않습니다. 잠시 후 다시 시도해 주세요.');
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="signup-container">
    <div class="signup-inner">
      <h2 class="signup-title">상다리에 오신 것을 환영합니다. 🎉</h2>
      <p class="signup-desc">*필수 항목입니다.</p>
  
      <form @submit.prevent="handleSubmit" class="signup-form">
        <div class="input-email input-container">
          <AuthInputComponent
            v-model = "signupForm.email"
            label="이메일"
            type="email"
            placeholder="example@email.com"
            style="width: 100%;"
            require
          />

          <BaseButton
                class="check-btn"
                @click="handleCheckDuplicateEmail"
                :disabled="isCheckingEmail || isEmailChecked"
              >
                {{ isCheckingEmail ? '확인 중...' : '중복확인' }}
              </BaseButton>
        </div>
        <p v-if="emailError" class="error-msg">{{ emailError }}</p>

        <div class="input-container">
          <AuthInputComponent
            v-model="signupForm.password"
            label="비밀번호"
            type="password"
            placeholder="대/소문자, 숫자, 특수문자 6 ~ 20자 이내"
            require
          />
        </div>
        <p v-if="passwordError" class="error-msg">{{ passwordError }}</p>

        <div class="input-container">
          <AuthInputComponent
            v-model="signupForm.passwordChk"
            label="비밀번호 확인"
            type="password"
            placeholder="비밀번호 재입력"
            require
          />
        </div>
        <p v-if="passwordChkError" class="error-msg">{{ passwordChkError }}</p>
        
        <div class="input-container">
          <AuthInputComponent
            v-model="signupForm.name"
            label="이름"
            placeholder="이름을 입력해주세요. (2 ~ 40자 이내)"
            require
          />
        </div>
        <p v-if="nameError" class="error-msg">{{ nameError }}</p>

        <div class="input-container">
          <AuthInputComponent
            v-model="signupForm.phone"
            label="연락처"
            type="tel"
            placeholder="하이픈(-) 없이 숫자만 입력해주세요. (11자리)"
            require
          />
        </div>
        <p v-if="phoneError" class="error-msg">{{ phoneError }}</p>

        <BaseButton
          type="submit"
          variant="primary"
          full-width
          style="margin-top: 25px;"
          :disabled="!isFormComplete || isLoading"
        >
          가입하기
        </BaseButton>
      </form>
    </div>
  </div>
</template>

<style scoped>
.signup-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.signup-inner {
  width: 400px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.signup-title {
  font-size: var(--text-5xl);
  font-weight: 800;
  color: var(--color-text);
  margin-bottom: 4px;
}

.signup-desc {
  font-size: var(--text-xs);
  text-align: right;
  color: var(--color-primary);
}

.signup-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.input-email {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.check-btn {
  height: 41px;
  align-self: self-end;
}

.error-msg {
  font-size: 0.8rem;
  color: #ff0000;
  margin-top: -8px;
  margin-bottom: -2px;
}
</style>