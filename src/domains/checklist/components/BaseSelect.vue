<script setup>
defineProps({
  id: { type: String, default: undefined },
  modelValue: { type: [String, Number], default: '' },
  options: { type: Array, default: () => [] },
  placeholder: { type: String, default: '' },
})

defineEmits(['update:modelValue'])
</script>

<template>
  <div class="form-select">
    <select
      :id="id"
      class="select-style"
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <option v-if="placeholder" value="">{{ placeholder }}</option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<style scoped>
.select-style {
  width: 100%;
  padding: 12px 14px;
  color: var(--color-text);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-white);
}

.select-style:focus {
  border-color: var(--color-primary);
  outline: none;
  box-shadow: none;
}
</style>
