<script setup>
// 공통 모달 컴포넌트
// Teleport를 사용해 모달을 body 바로 아래에 렌더링합니다.
// show prop이 true일 때 모달이 열립니다.
// 배경(오버레이)을 클릭하면 'close' 이벤트를 발생시킵니다.
//
// size 옵션:
//   'md' - 기본 크기 (최대 너비 420px)
//   'sm' - 작은 크기 (최대 너비 380px)

defineProps({
  show: { type: Boolean, default: false },
  size: { type: String,  default: 'md' },
})

defineEmits(['close'])
</script>

<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="modal-overlay"
      @click.self="$emit('close')"
    >
      <div
        role="dialog"
        aria-modal="true"
        :class="[
          'modal-box',
          {
            'modal-box--sm': size === 'sm',
            'modal-box--lg': size === 'lg',
          },
        ]"
      >
        <slot />
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-6);
  background: rgba(15, 23, 42, 0.45);
}

.modal-box {
  width: min(100%, var(--w-modal));
  max-height: calc(100vh - 48px);
  overflow-y: auto;
  border-radius: var(--radius-xl);
  background: var(--color-white);
  box-shadow: var(--shadow-lg);
}

.modal-box--sm {
  width: min(100%, var(--w-modal-sm));
}

.modal-box--lg {
  width: min(100%, var(--w-sm));
}
</style>
