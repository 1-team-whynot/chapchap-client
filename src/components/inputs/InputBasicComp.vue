<script setup>
const props = defineProps({
  'type': String
  , 'placeholder': String
  , 'readonly': Boolean
  , 'required': Boolean
  , 'borderColor': String
});

const model = defineModel();
</script>

<template>
  <input
    :type="props.type"
    :placeholder="props.placeholder"
    :readonly="props.readonly"
    :required="props.required"
    :class="[borderColor]"
    v-model="model"
  >
</template>

<style scoped>
input {
  padding: 10px 15px;
  border: 1px solid var(--brand-gray-color);
  border-radius: 7px;
  outline: none;
}

.orange:focus {
  border: 1px solid var(--brand-main-color);
}

.pink:focus {
  border: 1px solid var(--brand-point-color);
}

input::placeholder {
  color: #ccc;
}

input:focus::placeholder {
  color: transparent;
}
</style>