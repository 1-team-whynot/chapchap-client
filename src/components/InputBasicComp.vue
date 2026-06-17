<script setup>
const props = defineProps({
  'type': String
  , 'placeholder': String
  , 'readonly': Boolean
  , 'required': Boolean
});

const model = defineModel();
</script>

<template>
  <input
    :type="props.type"
    :placeholder="props.placeholder"
    :readonly="props.readonly"
    :required="props.required"
    v-model="model"
  >
</template>

<style scoped>

</style>