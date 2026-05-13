<template>
  <section id="cases" class="cases section">
    <div class="container">
      <h2 class="section-title fade-in">客户案例</h2>
      <p class="section-subtitle fade-in">
        与众多行业领军企业合作，共同创造成功故事
      </p>
      
      <div class="cases-grid">
        <div 
          v-for="(caseItem, index) in cases" 
          :key="caseItem.id"
          class="case-card fade-in"
          :style="{ transitionDelay: `${index * 0.15}s` }"
        >
          <div class="case-image">
            <div class="case-logo" :style="{ backgroundColor: caseItem.logoBg }">
              {{ caseItem.logo }}
            </div>
          </div>
          <div class="case-content">
            <span class="case-category">{{ caseItem.category }}</span>
            <h3 class="case-title">{{ caseItem.title }}</h3>
            <p class="case-description">{{ caseItem.description }}</p>
            <div class="case-results">
              <div class="result-item" v-for="result in caseItem.results" :key="result.label">
                <span class="result-value">{{ result.value }}</span>
                <span class="result-label">{{ result.label }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="trusted-by fade-in">
        <p class="trusted-by-label">受到众多企业信赖</p>
        <div class="logo-cloud">
          <span v-for="logo in trustedLogos" :key="logo" class="logo-item">
            {{ logo }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const cases = [
  {
    id: 1,
    logo: '🏦',
    logoBg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    category: '金融科技',
    title: '某大型银行数字化转型项目',
    description: '为客户打造全渠道数字化服务平台，实现业务流程自动化和客户体验升级',
    results: [
      { value: '+45%', label: '效率提升' },
      { value: '99.9%', label: '系统可用性' },
      { value: '200万+', label: '活跃用户' }
    ]
  },
  {
    id: 2,
    logo: '🏭',
    logoBg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    category: '智能制造',
    title: '制造业智能工厂解决方案',
    description: '通过物联网和大数据技术，实现生产过程的智能化监控和优化管理',
    results: [
      { value: '+30%', label: '产能提升' },
      { value: '-25%', label: '成本降低' },
      { value: '500+', label: '设备接入' }
    ]
  },
  {
    id: 3,
    logo: '🛒',
    logoBg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    category: '电子商务',
    title: '电商平台智能推荐系统',
    description: '基于AI算法的个性化推荐引擎，提升用户转化率和购物体验',
    results: [
      { value: '+60%', label: '转化率' },
      { value: '+35%', label: '客单价' },
      { value: '1000万+', label: '日活用户' }
    ]
  }
]

const trustedLogos = ['🏢 科技公司A', '🏪 零售集团B', '🏥 医疗机构C', '📱 通信公司D', '🚗 汽车企业E']
</script>

<style scoped lang="scss">
.cases {
  &-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: $spacing-xl;
    margin-top: $spacing-2xl;
  }
}

.case-card {
  background: white;
  border-radius: $border-radius-xl;
  overflow: hidden;
  box-shadow: $shadow-md;
  transition: all $transition-normal;

  &:hover {
    transform: translateY(-8px);
    box-shadow: $shadow-xl;
  }

  .case-image {
    padding: $spacing-2xl;
    display: flex;
    justify-content: center;
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  }

  .case-logo {
    width: 80px;
    height: 80px;
    border-radius: $border-radius-xl;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40px;
  }

  .case-content {
    padding: $spacing-2xl;
  }

  .case-category {
    display: inline-block;
    padding: $spacing-xs $spacing-md;
    background-color: rgba($primary-color, 0.1);
    color: $primary-color;
    border-radius: $border-radius-full;
    font-size: $font-size-xs;
    font-weight: 500;
    margin-bottom: $spacing-md;
  }

  .case-title {
    font-size: $font-size-xl;
    font-weight: 600;
    color: $text-dark;
    margin-bottom: $spacing-md;
    line-height: 1.4;
  }

  .case-description {
    color: $text-light;
    font-size: $font-size-sm;
    line-height: 1.6;
    margin-bottom: $spacing-lg;
  }

  .case-results {
    display: flex;
    gap: $spacing-lg;
    padding-top: $spacing-lg;
    border-top: 1px solid $border-color;
  }

  .result-item {
    display: flex;
    flex-direction: column;

    .result-value {
      font-size: $font-size-xl;
      font-weight: 700;
      color: $primary-color;
    }

    .result-label {
      font-size: $font-size-xs;
      color: $text-light;
    }
  }
}

.trusted-by {
  margin-top: $spacing-3xl;
  text-align: center;

  &-label {
    color: $text-light;
    font-size: $font-size-sm;
    margin-bottom: $spacing-xl;
  }

  .logo-cloud {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: $spacing-2xl;
    align-items: center;

    .logo-item {
      font-size: $font-size-lg;
      font-weight: 600;
      color: $text-light;
      padding: $spacing-md $spacing-xl;
      background: $bg-light;
      border-radius: $border-radius-lg;
      transition: all $transition-normal;

      &:hover {
        color: $primary-color;
        background: rgba($primary-color, 0.05);
      }
    }
  }
}

@media (max-width: $breakpoint-md) {
  .cases-grid {
    grid-template-columns: 1fr;
    gap: $spacing-lg;
  }

  .case-content {
    padding: $spacing-xl;
  }

  .case-results {
    gap: $spacing-md;
  }

  .logo-cloud {
    gap: $spacing-lg;
  }
}

@media (max-width: 480px) {
  .case-content {
    padding: $spacing-lg;
  }

  .case-image {
    padding: $spacing-lg;
  }

  .case-logo {
    width: 60px;
    height: 60px;
    font-size: 28px;
  }

  .case-title {
    font-size: $font-size-lg;
  }

  .case-description {
    font-size: $font-size-sm;
  }

  .case-results {
    .result-item {
      .result-value {
        font-size: $font-size-lg;
      }
      .result-label {
        font-size: $font-size-xs;
      }
    }
  }

  .logo-cloud {
    .logo-item {
      font-size: $font-size-sm;
      padding: $spacing-sm $spacing-md;
    }
  }
}
</style>
