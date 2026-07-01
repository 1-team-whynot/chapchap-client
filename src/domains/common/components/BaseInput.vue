<script setup>
// 공통 인풋 컴포넌트
// v-model로 값을 주고받습니다.
// error 값이 있으면 빨간 테두리와 에러 메시지가 표시됩니다.
// isValid가 true이면 초록 테두리로 표시됩니다.

defineProps({
  modelValue:  { type: String,         default: '' },
  label:       { type: String,         default: '' },
  type:        { type: String,         default: 'text' },
  placeholder: { type: String,         default: '' },
  error:       { type: String,         default: '' },
  disabled:    { type: Boolean,        default: false },
  readonly:    { type: Boolean,        default: false },
  min:         { type: String,         default: undefined },
  max:         { type: String,         default: undefined },
  maxlength:   { type: [String, Number], default: undefined },
  isValid:     { type: Boolean,        default: false },
})

defineEmits(['update:modelValue', 'enter'])
</script>

<template>
  <div class="field">

    <!-- 라벨 -->
    <label v-if="label" class="field-label">{{ label }}</label>

    <!-- 인풋 -->
    <input
      :class="[
        'field-input',
        {
          'field-input--error': error,
          'field-input--valid': isValid && !error,
        }
      ]"
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      :disabled="disabled"
      :readonly="readonly"
      :min="min"
      :max="max"
      :maxlength="maxlength"
      @input="$emit('update:modelValue', $event.target.value)"
      @keyup.enter="$emit('enter')"
    />

    <!-- 에러 메시지 -->
    <p v-if="error" class="field-error">{{ error }}</p>

  </div>
</template>

<style scoped>
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--color-text-sub);
}

.field-input {
  width: 100%;
  padding: 11px 14px;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-lg);
  font-size: var(--text-md);
  color: var(--color-text);
  background: var(--color-white);
  transition: border-color var(--transition-fast);
  font-family: inherit;
}

.field-input::placeholder {
  color: var(--color-text-placeholder);
}

.field-input:disabled {
  background: var(--color-bg-secondary);
  color: var(--color-text-placeholder);
  cursor: not-allowed;
}

/* 에러 상태: 빨간 테두리 */
.field-input--error {
  border-color: var(--color-danger-text) !important;
}

/* 유효 상태: 초록 테두리 */
.field-input--valid {
  border-color: #22C55E;
}

.field-error {
  font-size: var(--text-sm);
  color: #EF4444;
}
</style>
