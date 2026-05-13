<template>
  <section id="products" class="products section">
    <div class="container">
      <h2 class="section-title fade-in">我们的产品</h2>
      <p class="section-subtitle fade-in">
        为企业提供全方位的数字化解决方案，助力业务增长
      </p>
      
      <div class="products-grid">
        <div 
          v-for="(product, index) in products" 
          :key="product.id"
          class="product-card fade-in"
          :style="{ transitionDelay: `${index * 0.1}s` }"
        >
          <div class="product-icon" :style="{ backgroundColor: product.bgColor }">
            {{ product.icon }}
          </div>
          <h3 class="product-title">{{ product.title }}</h3>
          <p class="product-description">{{ product.description }}</p>
          <ul class="product-features">
            <li v-for="feature in product.features" :key="feature">
              <span class="check-icon">✓</span> {{ feature }}
            </li>
          </ul>
          <button class="btn btn-primary btn-block">
            了解更多
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const products = [
  {
    id: 1,
    icon: '💼',
    bgColor: 'rgba(37, 99, 235, 0.1)',
    title: '企业管理平台',
    description: '一站式企业管理解决方案，整合CRM、ERP、OA等核心功能',
    features: [
      '客户关系管理',
      '供应链管理',
      '财务核算系统',
      '智能报表分析'
    ]
  },
  {
    id: 2,
    icon: '📱',
    bgColor: 'rgba(245, 158, 11, 0.1)',
    title: '移动办公应用',
    description: '随时随地高效办公，支持多端同步，提升团队协作效率',
    features: [
      '实时消息推送',
      '移动审批流程',
      '文档云端存储',
      '视频会议集成'
    ]
  },
  {
    id: 3,
    icon: '🔐',
    bgColor: 'rgba(16, 185, 129, 0.1)',
    title: '安全防护系统',
    description: '企业级网络安全解决方案，全方位保护您的数据资产',
    features: [
      '数据加密传输',
      '入侵检测系统',
      '安全漏洞扫描',
      '灾备恢复方案'
    ]
  },
  {
    id: 4,
    icon: '🤖',
    bgColor: 'rgba(139, 92, 246, 0.1)',
    title: 'AI智能助手',
    description: '基于人工智能的智能客服与数据分析助手，提升服务效率',
    features: [
      '智能客服机器人',
      '自然语言处理',
      '情感分析功能',
      '智能推荐系统'
    ]
  }
]
</script>

<style scoped lang="scss">
.products {
  background-color: $bg-light;

  &-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: $spacing-xl;
    margin-top: $spacing-2xl;
  }
}

.product-card {
  background: white;
  border-radius: $border-radius-xl;
  padding: $spacing-2xl;
  box-shadow: $shadow-md;
  transition: all $transition-normal;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-8px);
    box-shadow: $shadow-xl;
  }

  .product-icon {
    width: 64px;
    height: 64px;
    border-radius: $border-radius-lg;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    margin-bottom: $spacing-xl;
  }

  .product-title {
    font-size: $font-size-xl;
    font-weight: 600;
    color: $text-dark;
    margin-bottom: $spacing-md;
  }

  .product-description {
    color: $text-light;
    font-size: $font-size-base;
    line-height: 1.6;
    margin-bottom: $spacing-lg;
  }

  .product-features {
    margin-bottom: $spacing-xl;
    flex: 1;

    li {
      display: flex;
      align-items: center;
      gap: $spacing-sm;
      padding: $spacing-sm 0;
      color: $text-dark;
      font-size: $font-size-sm;

      .check-icon {
        color: $success-color;
        font-weight: bold;
      }
    }
  }
}

.btn-block {
  width: 100%;
}

@media (max-width: $breakpoint-md) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: $spacing-lg;
  }

  .product-card {
    padding: $spacing-xl;
  }
}

@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: 1fr;
  }

  .product-card {
    padding: $spacing-lg;

    .product-icon {
      width: 48px;
      height: 48px;
      font-size: 24px;
      margin-bottom: $spacing-lg;
    }

    .product-title {
      font-size: $font-size-lg;
    }

    .product-description {
      font-size: $font-size-sm;
    }
  }
}
</style>
