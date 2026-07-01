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
const isEmailChecked = ref(false);
const isCheckingEmail = ref(false);

// 이메일 입력값이 변경되면 중복확인 상태를 false로 초기화
watch(() => signupForm.email, () => {
  isEmailChecked.value = false
});

const handleCheckDuplicateEmail = async () => {
  emailError.value = ''
  isEmailChecked.value = false

  const emailValError = email(signupForm.email)
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

  const validationList = [
    signupValidator.email(signupForm.email)
    , signupValidator.password(signupForm.password)
    , signupValidator.passwordChk(signupForm.password, signupForm.passwordChk)
    , signupValidator.name(signupForm.name)
    , signupValidator.phone(signupForm.phone)
  ];

  const errorList = validationList.filter(val => val);

  if(errorList.length > 0) {
    alert(errorList.join('\n'));
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
      if(data.code === 'E11') {
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

        <div class="input-container">
          <AuthInputComponent
            v-model="signupForm.passwordChk"
            label="비밀번호 확인"
            type="password"
            placeholder="비밀번호 재입력"
            require
          />
        </div>
        
        <div class="input-container">
          <AuthInputComponent
            v-model="signupForm.name"
            label="이름"
            placeholder="이름을 입력해주세요. (2 ~ 40자 이내)"
            require
          />
        </div>

        <div class="input-container">
          <AuthInputComponent
            v-model="signupForm.phone"
            label="연락처"
            type="tel"
            placeholder="하이픈(-) 없이 숫자만 입력해주세요. (11자리)"
            require
          />
        </div>

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
</style>