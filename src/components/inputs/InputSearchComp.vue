<script setup>
// 부모에서 전달받을 input 옵션들
const props = defineProps({
  // input 타입
  // text, email, password, tel 등을 받을 수 있음
  type: {
    type: String,
    default: 'text',
  },

  // input 안에 보여줄 안내 문구
  placeholder: {
    type: String,
    default: '',
  },

  // 읽기 전용 여부
  // true이면 입력값을 수정할 수 없음
  readonly: {
    type: Boolean,
    default: false,
  },

  // 필수 입력 여부
  required: {
    type: Boolean,
    default: false,
  },
});

// 부모의 v-model과 연결되는 값
// Vue 3.4 이상에서 사용 가능
const model = defineModel();
</script>

<template>
  <div class="base-input-container">
    <input
      class="base-input"
      :type="props.type"
      :placeholder="props.placeholder"
      :readonly="props.readonly"
      :required="props.required"
      v-model="model"
    />

    <div v-if="$slots.icon" class="base-input-icon">
      <slot name="icon" />
    </div>
  </div>
</template>

<style scoped>
.base-input-container {
  width: 100%;
  height: 40px;
  background-color: var(--brand-gray-color);
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 20px;
  border-radius: 7px;
}

.base-input-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--brand-font-color);
  flex-shrink: 0;
}

.base-input {
  width: 100%;
  border: none;
  outline: none;
  font-size: 16px;
  font-weight: 700;
  color: var(--brand-font-color);
  background-color: transparent;
}

.base-input::placeholder {
  color: #b8afad;
}
</style>