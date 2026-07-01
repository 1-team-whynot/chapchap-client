<script setup>
const props = defineProps({
  label: {
    type: String
    , default: '' 
  }
  , type: {
    type: String
    , default: 'text'
  }
  , placeholder: {
    type: String
    , default: ''
  }
  , readonly: {
    type: Boolean
    , default: false
  }
  , require: {
    type: Boolean
    , default: false
  }
})

const model = defineModel();
</script>

<template>
  <div class="auth-input-container">
        <!-- 라벨 (require일 경우 앞쪽에 * 표시) -->
        <label v-if="label" class="auth-label">
          <span v-if="require" class="required-mark">*</span>{{ label }}
        </label>
        
        <!-- 인풋 -->
        <input
          v-model="model"
          class="auth-input"
          :type="type"
          :placeholder="placeholder"
          :readonly="readonly"
          :required="require"
        />
      </div>
</template>

<style scoped>
.auth-input-container {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.auth-label {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--color-text-sub);
}

.auth-input {
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

.auth-input::placeholder {
  color: var(--color-text-placeholder);
}

.auth-input:focus::placeholder {
  color: transparent
}

.auth-input:focus {
  outline: none;
  border: 1.5px solid var(--color-accent);
}

/* 필수 표시 (*) 스타일 */
.required-mark {
  color: var(--color-primary);
  margin-right: 4px;
}
</style>
