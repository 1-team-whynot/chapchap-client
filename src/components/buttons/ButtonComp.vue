<script setup>
defineProps({
  'btnType': {
    type: String,
    default: 'button'
  }, // 'button', 'submit', 'reset'
  'size': String,
  'color': String, 
  'content': String
});
</script>

<template>
  <button
    :type="btnType"
    :class="[color, size]"
  >{{ content }}
  </button>
</template>

<style scoped>
button {
  border-radius: 7px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  cursor: pointer;
}

.big {
  width: 350px;
  height: 45px;
  font-size: 20px;
}

.middle {
  width: 300px;
  height: 70px;
  font-size: 40px;
}

.small {
  width: 120px;
  height: 35px;
  font-size: 16px;
}

.orange {
  background-color: var(--brand-main-color);
  color: var(--brand-white-color);
}

.pink {
  background-color: var(--brand-point-color);
  color: var(--brand-white-color);
}

.white {
  background-color: var(--brand-white-color);
  color: var(--brand-font-color);
  border: 1px solid var(--brand-main-color);
}
</style>