<script setup>
// 푸터 컴포넌트
</script>

<template>
  <footer class="footer">
    <div class="footer-inner container">
      <div class="footer-grid">
        <!-- 브랜드 소개 -->
        <div class="footer-brand">
          <h2 class="footer-brand-title">
            상다리
          </h2>

          <p class="footer-tagline">
            밥차·푸드트럭 행사 중개 플랫폼<br />
            소규모 모임부터 대규모 행사까지
          </p>
        </div>

        <!-- 서비스 링크 -->
        <div class="footer-col">
          <h3 class="footer-col-title">
            서비스
          </h3>

          <a href="#" class="footer-link">서비스 소개</a>
          <a href="#" class="footer-link">이용 방법</a>
          <a href="#" class="footer-link">요금 안내</a>
        </div>

        <!-- 약관 링크 -->
        <div class="footer-col">
          <h3 class="footer-col-title">
            약관
          </h3>

          <a href="#" class="footer-link">이용약관</a>
          <a href="#" class="footer-link">개인정보처리방침</a>
        </div>
      </div>

      <!-- 카피라이트 -->
      <div class="footer-bottom">
        <span>© 2026 상다리. All rights reserved.</span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  margin-top: auto;
  background: linear-gradient(135deg, #3b2416 0%, #4a2c1a 55%, #5a351f 100%);
  color: #d6c2ad;
}

.footer-inner {
  padding-top: var(--space-10);
  padding-bottom: var(--space-6);
}

/* 위쪽 링크 영역 */
.footer-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr;
  gap: var(--space-10);
  padding-bottom: var(--space-8);
  align-items: flex-start;
}

/* 브랜드 */
.footer-brand {
  min-width: 0;
}

.footer-brand-title {
  margin: 0 0 var(--space-3);
  color: #fff7ed;
  font-size: var(--text-xl);
  font-weight: 900;
  line-height: 1.4;
}

.footer-tagline {
  margin: 0;
  color: #e7d3bd;
  font-size: var(--text-base);
  line-height: 1.7;
}

/* 컬럼 */
.footer-col {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  min-width: 0;
}

.footer-col-title {
  margin: 0 0 4px;
  color: #fff7ed;
  font-size: var(--text-base);
  font-weight: 800;
  line-height: 1.4;
}

.footer-link {
  width: fit-content;
  color: #d6c2ad;
  font-size: var(--text-base);
  line-height: 1.4;
  text-decoration: none;
  transition:
    color var(--transition-fast),
    transform var(--transition-fast);
}

.footer-link:hover {
  color: #ffb26b;
  transform: translateX(2px);
}

/* 아래 카피라이트 영역 */
.footer-bottom {
  border-top: 1px solid rgba(255, 237, 213, 0.22);
  padding-top: var(--space-5);
  display: flex;
  justify-content: flex-end;
  align-items: center;
  color: #c9aa8b;
  font-size: var(--text-sm);
  line-height: 1.4;
}

.footer-bottom span {
  display: block;
}

/* 반응형 */
@media (max-width: 900px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: var(--space-8);
  }

  .footer-brand {
    grid-column: 1 / -1;
  }
}

@media (max-width: 560px) {
  .footer-inner {
    padding-top: var(--space-8);
    padding-bottom: var(--space-5);
  }

  .footer-grid {
    grid-template-columns: 1fr;
    gap: var(--space-6);
  }

  .footer-bottom {
    justify-content: flex-start;
  }
}
</style>