<template>
  <section id="hero" class="hero">
    <div class="container hero-container">
      <div class="hero-content fade-in">
        <span class="hero-badge">🚀 创新科技引领者</span>
        <h1 class="hero-title">
          用科技赋能<br />
          <span class="text-gradient">企业数字化转型</span>
        </h1>
        <p class="hero-subtitle">
          我们提供全方位的企业级解决方案，助力您的业务实现数字化升级，
          提升效率，创造更大价值。
        </p>
        <div class="hero-actions">
          <button class="btn btn-primary btn-lg">
            开始探索
            <span>→</span>
          </button>
          <button class="btn btn-secondary btn-lg">
            观看演示
          </button>
        </div>
        <div class="hero-stats">
          <div class="stat-item">
            <span class="stat-number">500+</span>
            <span class="stat-label">服务客户</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">99%</span>
            <span class="stat-label">满意度</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">10年</span>
            <span class="stat-label">行业经验</span>
          </div>
        </div>
      </div>
      <div class="hero-visual fade-in-right">
        <div class="hero-card card-1">
          <div class="card-icon">📊</div>
          <h4>数据分析</h4>
          <p>实时洞察业务数据</p>
        </div>
        <div class="hero-card card-2">
          <div class="card-icon">⚡</div>
          <h4>高效协作</h4>
          <p>团队无缝对接</p>
        </div>
        <div class="hero-card card-3">
          <div class="card-icon">🔒</div>
          <h4>安全可靠</h4>
          <p>企业级安全保障</p>
        </div>
      </div>
    </div>
    <div class="hero-bg-decoration"></div>
  </section>
</template>

<script setup>
</script>

<style scoped lang="scss">
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  padding-top: 80px;
  background: linear-gradient(180deg, #f0f7ff 0%, #ffffff 100%);

  &-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $spacing-3xl;
    align-items: center;
    position: relative;
    z-index: 1;
  }

  &-content {
    max-width: 600px;
  }

  &-badge {
    display: inline-block;
    padding: $spacing-sm $spacing-lg;
    background-color: rgba($primary-color, 0.1);
    color: $primary-color;
    border-radius: $border-radius-full;
    font-size: $font-size-sm;
    font-weight: 500;
    margin-bottom: $spacing-xl;
  }

  &-title {
    font-size: $font-size-5xl;
    font-weight: 800;
    line-height: 1.2;
    margin-bottom: $spacing-xl;
    color: $text-dark;

    .text-gradient {
      background: linear-gradient(135deg, $primary-color, $accent-color);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }

  &-subtitle {
    font-size: $font-size-lg;
    color: $text-light;
    line-height: 1.8;
    margin-bottom: $spacing-2xl;
  }

  &-actions {
    display: flex;
    gap: $spacing-lg;
    margin-bottom: $spacing-2xl;
    flex-wrap: wrap;
  }

  &-stats {
    display: flex;
    gap: $spacing-2xl;
  }

  &-visual {
    position: relative;
    height: 500px;
  }

  &-bg-decoration {
    position: absolute;
    top: -50%;
    right: -20%;
    width: 800px;
    height: 800px;
    background: radial-gradient(circle, rgba($primary-color, 0.08) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }
}

.btn-lg {
  padding: $spacing-lg $spacing-2xl;
  font-size: $font-size-lg;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;

  .stat-number {
    font-size: $font-size-2xl;
    font-weight: 700;
    color: $text-dark;
  }

  .stat-label {
    font-size: $font-size-sm;
    color: $text-light;
  }
}

.hero-card {
  position: absolute;
  background: white;
  border-radius: $border-radius-xl;
  padding: $spacing-xl;
  box-shadow: $shadow-xl;
  transition: transform $transition-normal;

  &:hover {
    transform: translateY(-5px);
  }

  .card-icon {
    font-size: $font-size-3xl;
    margin-bottom: $spacing-md;
  }

  h4 {
    font-size: $font-size-lg;
    font-weight: 600;
    margin-bottom: $spacing-xs;
    color: $text-dark;
  }

  p {
    font-size: $font-size-sm;
    color: $text-light;
  }

  &.card-1 {
    top: 20px;
    right: 40px;
  }

  &.card-2 {
    top: 180px;
    left: 20px;
  }

  &.card-3 {
    bottom: 40px;
    right: 60px;
  }
}

@media (max-width: $breakpoint-lg) {
  .hero {
    &-container {
      grid-template-columns: 1fr;
      text-align: center;
    }

    &-title {
      font-size: $font-size-4xl;
    }

    &-actions {
      justify-content: center;
    }

    &-stats {
      justify-content: center;
    }

    &-visual {
      height: 400px;
      max-width: 500px;
      margin: 0 auto;
    }
  }
}

@media (max-width: $breakpoint-md) {
  .hero {
    min-height: auto;
    padding: 100px 0 60px;

    &-title {
      font-size: $font-size-3xl;
    }

    &-subtitle {
      font-size: $font-size-base;
    }

    &-visual {
      height: 350px;
    }

    &-stats {
      gap: $spacing-xl;
      flex-wrap: wrap;
    }
  }

  .hero-card {
    padding: $spacing-md $spacing-lg;
    max-width: 140px;

    .card-icon {
      font-size: $font-size-2xl;
      margin-bottom: $spacing-sm;
    }

    h4 {
      font-size: $font-size-base;
    }

    p {
      font-size: $font-size-xs;
    }

    &.card-1 {
      top: 10px;
      right: 10px;
    }

    &.card-2 {
      top: 120px;
      left: 0;
    }

    &.card-3 {
      bottom: 20px;
      right: 20px;
    }
  }

  .btn-lg {
    padding: $spacing-md $spacing-xl;
    font-size: $font-size-base;
    width: 100%;
  }
}

@media (max-width: 480px) {
  .hero {
    &-title {
      font-size: $font-size-2xl;
      br {
        display: none;
      }
    }

    &-visual {
      height: 280px;
      max-width: 100%;
    }

    &-stats {
      gap: $spacing-lg;
      justify-content: space-around;
    }
  }

  .stat-item {
    .stat-number {
      font-size: $font-size-xl;
    }
    .stat-label {
      font-size: $font-size-xs;
    }
  }

  .hero-card {
    max-width: 120px;
    padding: $spacing-sm $spacing-md;

    &.card-1 {
      top: 0;
      right: 0;
    }

    &.card-2 {
      top: 90px;
      left: 0;
    }

    &.card-3 {
      bottom: 10px;
      right: 10px;
    }
  }
}
</style>
