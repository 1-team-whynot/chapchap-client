<script setup>
// 공통 버튼 컴포넌트
//
// variant 옵션:
//   primary       - 주황색 채우기 (주요 액션)
//   secondary     - 네이비색 채우기 (보조 액션)
//   outline       - 주황색 테두리, 흰 배경
//   ghost         - 회색 테두리, 흰 배경 (취소, 닫기 등)
//   danger        - 빨간 테두리, 흰 배경 (경고성 액션)
//   danger-filled - 빨간 채우기 (삭제, 확정 취소 등 위험한 액션)
//   cta           - 흰 배경, 주황 글씨 (CTA 섹션에서 사용)
//
// size 옵션:
//   md - 기본 크기
//   sm - 작은 크기
//
// fullWidth: true로 설정하면 버튼이 부모 너비를 꽉 채웁니다.

defineProps({
  variant: {
    type: String,
    default: 'primary',
  },
  size: {
    type: String,
    default: 'md',
  },
  fullWidth: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: 'button',
  },
})
</script>

<template>
  <button
    :type="type"
    :class="[
      'btn',
      `btn--${variant}`,
      {
        'btn--full': fullWidth,
        'btn--sm': size === 'sm',
      },
    ]"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<style scoped>
/* 기본 버튼 스타일 */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 13px 24px;
  border-radius: var(--radius-lg);
  border: 1.5px solid transparent;
  font-size: var(--text-lg);
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
}

/* 작은 버튼 */
.btn--sm {
  padding: 8px 16px;
  font-size: var(--text-md);
  border-radius: var(--radius-md);
}

/* 가로 전체 너비 */
.btn--full {
  width: 100%;
}

/* 주요 액션 버튼 */
.btn--primary {
  background: var(--color-primary);
  color: var(--color-white);
  border-color: var(--color-primary);
}

.btn--primary:hover:not(:disabled) {
  background: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
}

/* 보조 액션 버튼 */
.btn--secondary {
  background: var(--color-navy);
  color: var(--color-white);
  border-color: var(--color-navy);
}

.btn--secondary:hover:not(:disabled) {
  background: var(--color-navy-dark);
  border-color: var(--color-navy-dark);
}

/* 테두리 버튼 */
.btn--outline {
  background: var(--color-white);
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.btn--outline:hover:not(:disabled) {
  background: var(--color-primary-light);
}

/* 회색 테두리 버튼 */
.btn--ghost {
  background: var(--color-white);
  color: var(--color-text-sub);
  border-color: var(--color-border);
}

.btn--ghost:hover:not(:disabled) {
  background: var(--color-bg-alt);
}

/* 경고성 버튼 */
.btn--danger {
  background: var(--color-white);
  color: var(--color-danger);
  border-color: var(--color-danger-border);
}

.btn--danger:hover:not(:disabled) {
  background: var(--color-danger-light);
}

/* 위험한 액션 버튼 */
.btn--danger-filled {
  background: var(--color-danger);
  color: var(--color-white);
  border-color: var(--color-danger);
}

.btn--danger-filled:hover:not(:disabled) {
  background: var(--color-danger-dark);
  border-color: var(--color-danger-dark);
}

/* CTA 섹션용 버튼 */
.btn--cta {
  background: var(--color-white);
  color: var(--color-primary);
  border-color: transparent;
  font-size: var(--text-xl);
  font-weight: 800;
  padding: 14px 36px;
  border-radius: var(--radius-lg);
}

.btn--cta:hover:not(:disabled) {
  background: var(--color-primary-light);
}

/* 비활성화 상태 */
.btn:disabled {
  background: var(--color-border);
  color: var(--color-text-placeholder);
  border-color: var(--color-border);
  cursor: not-allowed;
}
</style>