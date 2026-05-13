<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="footer-logo">
            <span class="logo-icon">智</span>
            <span class="logo-text">智和科技</span>
          </div>
          <p class="brand-description">
            专注企业数字化转型，用科技赋能商业未来。我们致力于为客户提供最优质的产品和服务。
          </p>
          <div class="social-links">
            <a v-for="social in socials" :key="social.name" href="#" class="social-link">
              {{ social.icon }}
            </a>
          </div>
        </div>

        <div class="footer-column" v-for="column in footerColumns" :key="column.title">
          <h4 class="column-title">{{ column.title }}</h4>
          <ul class="column-links">
            <li v-for="link in column.links" :key="link">
              <a href="#">{{ link }}</a>
            </li>
          </ul>
        </div>

        <div class="footer-column">
          <h4 class="column-title">订阅资讯</h4>
          <p class="subscribe-text">订阅我们的 newsletter，获取最新动态</p>
          <form class="subscribe-form" @submit.prevent="handleSubscribe">
            <input 
              type="email" 
              v-model="subscribeEmail" 
              placeholder="输入您的邮箱"
              required
            />
            <button type="submit" class="subscribe-btn">
              订阅
            </button>
          </form>
          <div v-if="subscribeSuccess" class="subscribe-success">
            ✓ 订阅成功！
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p class="copyright">© 2024 智和科技. 保留所有权利.</p>
        <div class="legal-links">
          <a href="#">隐私政策</a>
          <a href="#">服务条款</a>
          <a href="#">网站地图</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue'

const socials = [
  { name: '微信', icon: '💬' },
  { name: '微博', icon: '📢' },
  { name: 'LinkedIn', icon: '🔗' },
  { name: 'GitHub', icon: '🐙' }
]

const footerColumns = [
  {
    title: '产品服务',
    links: ['企业管理平台', '移动办公应用', '安全防护系统', 'AI智能助手']
  },
  {
    title: '解决方案',
    links: ['金融行业方案', '制造业方案', '电商行业方案', '医疗行业方案']
  },
  {
    title: '关于我们',
    links: ['公司介绍', '发展历程', '加入我们', '联系我们']
  }
]

const subscribeEmail = ref('')
const subscribeSuccess = ref(false)

const handleSubscribe = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  subscribeSuccess.value = true
  subscribeEmail.value = ''
  
  setTimeout(() => {
    subscribeSuccess.value = false
  }, 3000)
}
</script>

<style scoped lang="scss">
.footer {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  color: white;
  padding-top: $spacing-3xl;

  &-grid {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr;
    gap: $spacing-2xl;
    margin-bottom: $spacing-2xl;
  }
}

.footer-brand {
  .footer-logo {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    font-weight: 700;
    font-size: $font-size-xl;
    margin-bottom: $spacing-lg;

    .logo-icon {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, $primary-color, $accent-color);
      border-radius: $border-radius-md;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: $font-size-lg;
    }

    .logo-text {
      color: white;
    }
  }

  .brand-description {
    color: #94a3b8;
    font-size: $font-size-sm;
    line-height: 1.6;
    margin-bottom: $spacing-lg;
  }

  .social-links {
    display: flex;
    gap: $spacing-md;

    .social-link {
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      transition: all $transition-normal;

      &:hover {
        background: $primary-color;
        transform: translateY(-3px);
      }
    }
  }
}

.footer-column {
  .column-title {
    font-size: $font-size-base;
    font-weight: 600;
    margin-bottom: $spacing-lg;
    color: white;
  }

  .column-links {
    li {
      margin-bottom: $spacing-md;

      a {
        color: #94a3b8;
        font-size: $font-size-sm;
        transition: color $transition-fast;

        &:hover {
          color: $primary-color;
        }
      }
    }
  }

  .subscribe-text {
    color: #94a3b8;
    font-size: $font-size-sm;
    margin-bottom: $spacing-md;
  }

  .subscribe-form {
    display: flex;
    gap: $spacing-sm;
    margin-bottom: $spacing-md;

    input {
      flex: 1;
      padding: $spacing-sm $spacing-md;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: $border-radius-md;
      background: rgba(255, 255, 255, 0.1);
      color: white;
      font-size: $font-size-sm;

      &::placeholder {
        color: #64748b;
      }

      &:focus {
        outline: none;
        border-color: $primary-color;
      }
    }

    .subscribe-btn {
      padding: $spacing-sm $spacing-lg;
      background: $primary-color;
      color: white;
      border: none;
      border-radius: $border-radius-md;
      font-size: $font-size-sm;
      font-weight: 500;
      cursor: pointer;
      transition: all $transition-fast;

      &:hover {
        background: darken($primary-color, 10%);
      }
    }
  }

  .subscribe-success {
    color: $success-color;
    font-size: $font-size-sm;
  }
}

.footer-bottom {
  padding: $spacing-xl 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;

  .copyright {
    color: #64748b;
    font-size: $font-size-sm;
  }

  .legal-links {
    display: flex;
    gap: $spacing-lg;

    a {
      color: #64748b;
      font-size: $font-size-sm;
      transition: color $transition-fast;

      &:hover {
        color: $primary-color;
      }
    }
  }
}

@media (max-width: $breakpoint-lg) {
  .footer-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .footer-brand {
    grid-column: 1 / -1;
  }
}

@media (max-width: $breakpoint-md) {
  .footer-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: $spacing-xl;
  }

  .footer-bottom {
    flex-direction: column;
    gap: $spacing-md;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .footer-grid {
    grid-template-columns: 1fr;
  }
}
</style>
