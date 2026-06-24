<script setup>
// 드롭다운 컴포넌트
// options 배열에 { regionId(백에 보낼 값), name(프론트에서 텍스트) } 객체를 넣을 수 있습니다.
// v-model로 선택된 값을 주고받습니다.

defineProps({
  modelValue: { type: String, default: '' },
  options:     { type: Array, default: () => [] },
  placeholder: { type: String, default: '' },
});
</script>

<template>
<div class="form-select">

  <!-- 드롭다운 -->
    <!-- :value="modelValue" => v-model의 값(select의 for값) -->
    <!-- $emit( ... ) => 자식이 지닌 값 부모에게 전달 -->
    <!-- target.value => 선택된 옵션 값 -->
  <select 
    class="select-style"
    :value="modelValue"
    @change="$emit('update:modelValue', $event.target.value)"
  >

    <!-- 플래이스홀더 -->
    <option v-if="placeholder" value="">{{ placeholder }}</option>

    <!-- 옵션 목록 -->
      <!-- options배열의 값을 사용 -->
      <!-- value => 실제 값을 저장 // key => vue가 개별 항목 판별하기 위해 사용 -->
    <option
      v-for="option in options"
      :value="option.regionId"
      :key="option.regionId"
    >
      {{ option.name }}
    </option>

  </select>
</div>
</template>

<style scoped>
.select-style {
  width: 100%;
  padding: 10px 0 10px 10px;
  color: gray;
  border: 1px solid gray;
  border-radius: 10px;
}

.select-style:focus {
  border: 2px solid orangered;
  /* 브라우저 기본 스타일 삭제 */
  outline: none;
  box-shadow: none;
}
</style>