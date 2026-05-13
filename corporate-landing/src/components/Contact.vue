<template>
  <section id="contact" class="contact section">
    <div class="container">
      <h2 class="section-title fade-in">联系我们</h2>
      <p class="section-subtitle fade-in">
        有任何问题或合作意向？我们随时准备为您服务
      </p>
      
      <div class="contact-wrapper">
        <div class="contact-info fade-in-left">
          <h3>联系方式</h3>
          <p class="info-description">
            欢迎通过以下方式与我们取得联系，我们的专业团队将在24小时内回复您。
          </p>
          
          <div class="info-items">
            <div class="info-item" v-for="item in contactInfo" :key="item.label">
              <span class="info-icon">{{ item.icon }}</span>
              <div class="info-content">
                <span class="info-label">{{ item.label }}</span>
                <span class="info-value">{{ item.value }}</span>
              </div>
            </div>
          </div>

          <div class="work-hours">
            <h4>工作时间</h4>
            <p>周一至周五: 9:00 - 18:00</p>
            <p>周六: 10:00 - 16:00</p>
            <p>周日: 休息</p>
          </div>
        </div>

        <div class="contact-form-wrapper fade-in-right">
          <form class="contact-form" @submit.prevent="handleSubmit">
            <div class="form-row">
              <div class="form-group">
                <label for="name">姓名 *</label>
                <input 
                  type="text" 
                  id="name" 
                  v-model="formData.name" 
                  required
                  placeholder="请输入您的姓名"
                />
              </div>
              <div class="form-group">
                <label for="email">邮箱 *</label>
                <input 
                  type="email" 
                  id="email" 
                  v-model="formData.email" 
                  required
                  placeholder="请输入您的邮箱"
                />
              </div>
            </div>
            
            <div class="form-group">
              <label for="company">公司名称</label>
              <input 
                type="text" 
                id="company" 
                v-model="formData.company"
                placeholder="请输入公司名称"
              />
            </div>
            
            <div class="form-group">
              <label for="subject">咨询主题</label>
              <select id="subject" v-model="formData.subject">
                <option value="">请选择咨询主题</option>
                <option value="product">产品咨询</option>
                <option value="service">技术服务</option>
                <option value="cooperation">商务合作</option>
                <option value="other">其他</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="message">留言内容 *</label>
              <textarea 
                id="message" 
                v-model="formData.message" 
                required
                rows="5"
                placeholder="请详细描述您的需求..."
              ></textarea>
            </div>
            
            <button type="submit" class="btn btn-primary btn-submit" :disabled="isSubmitting">
              <span v-if="!isSubmitting">提交留言</span>
              <span v-else>提交中...</span>
            </button>
            
            <div v-if="submitSuccess" class="success-message">
              ✓ 提交成功！我们会尽快与您联系。
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  name: '',
  email: '',
  company: '',
  subject: '',
  message: ''
})

const isSubmitting = ref(false)
const submitSuccess = ref(false)

const contactInfo = [
  { icon: '📞', label: '电话', value: '400-888-8888' },
  { icon: '📧', label: '邮箱', value: 'contact@zhihe.com' },
  { icon: '📍', label: '地址', value: '北京市朝阳区科技园区A座18层' }
]

const handleSubmit = async () => {
  isSubmitting.value = true
  
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  isSubmitting.value = false
  submitSuccess.value = true
  
  formData.value = {
    name: '',
    email: '',
    company: '',
    subject: '',
    message: ''
  }
  
  setTimeout(() => {
    submitSuccess.value = false
  }, 3000)
}
</script>

<style scoped lang="scss">
.contact {
  background: linear-gradient(180deg, #f0f9ff 0%, white 100%);

  &-wrapper {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: $spacing-3xl;
    margin-top: $spacing-2xl;
  }
}

.contact-info {
  h3 {
    font-size: $font-size-2xl;
    font-weight: 600;
    color: $text-dark;
    margin-bottom: $spacing-md;
  }

  .info-description {
    color: $text-light;
    line-height: 1.6;
    margin-bottom: $spacing-2xl;
  }

  .info-items {
    margin-bottom: $spacing-2xl;
  }

  .info-item {
    display: flex;
    align-items: flex-start;
    gap: $spacing-lg;
    padding: $spacing-lg 0;
    border-bottom: 1px solid $border-color;

    &:last-child {
      border-bottom: none;
    }

    .info-icon {
      width: 48px;
      height: 48px;
      background: rgba($primary-color, 0.1);
      border-radius: $border-radius-lg;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      flex-shrink: 0;
    }

    .info-content {
      display: flex;
      flex-direction: column;
      gap: $spacing-xs;
      padding-top: $spacing-xs;

      .info-label {
        font-size: $font-size-sm;
        color: $text-light;
        font-weight: 500;
      }

      .info-value {
        font-size: $font-size-base;
        color: $text-dark;
        font-weight: 500;
      }
    }
  }

  .work-hours {
    background: white;
    padding: $spacing-xl;
    border-radius: $border-radius-xl;
    box-shadow: $shadow-sm;

    h4 {
      font-size: $font-size-lg;
      font-weight: 600;
      color: $text-dark;
      margin-bottom: $spacing-md;
    }

    p {
      color: $text-light;
      font-size: $font-size-sm;
      margin-bottom: $spacing-xs;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

.contact-form-wrapper {
  background: white;
  padding: $spacing-2xl;
  border-radius: $border-radius-xl;
  box-shadow: $shadow-md;
}

.contact-form {
  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $spacing-lg;
  }

  .form-group {
    margin-bottom: $spacing-lg;

    label {
      display: block;
      font-size: $font-size-sm;
      font-weight: 500;
      color: $text-dark;
      margin-bottom: $spacing-sm;
    }

    input,
    select,
    textarea {
      width: 100%;
      padding: $spacing-md $spacing-lg;
      border: 2px solid $border-color;
      border-radius: $border-radius-lg;
      font-size: $font-size-base;
      font-family: inherit;
      transition: border-color $transition-fast;
      background: white;

      &:focus {
        outline: none;
        border-color: $primary-color;
      }

      &::placeholder {
        color: #94a3b8;
      }
    }

    textarea {
      resize: vertical;
      min-height: 120px;
    }
  }

  .btn-submit {
    width: 100%;
    padding: $spacing-lg;
    font-size: $font-size-lg;

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }

  .success-message {
    margin-top: $spacing-lg;
    padding: $spacing-md $spacing-lg;
    background: rgba($success-color, 0.1);
    color: $success-color;
    border-radius: $border-radius-lg;
    text-align: center;
    font-weight: 500;
  }
}

@media (max-width: $breakpoint-lg) {
  .contact-wrapper {
    grid-template-columns: 1fr;
    gap: $spacing-2xl;
  }
}

@media (max-width: $breakpoint-md) {
  .contact-form-wrapper {
    padding: $spacing-xl;
  }

  .contact-form {
    .form-row {
      grid-template-columns: 1fr;
    }

    .btn-submit {
      padding: $spacing-md;
      font-size: $font-size-base;
    }
  }

  .contact-info {
    .info-item {
      gap: $spacing-md;
      padding: $spacing-md 0;
    }

    .work-hours {
      padding: $spacing-lg;
    }
  }
}

@media (max-width: 480px) {
  .contact-form-wrapper {
    padding: $spacing-lg;
  }

  .contact-form {
    .form-group {
      margin-bottom: $spacing-md;

      label {
        font-size: $font-size-sm;
      }

      input,
      select,
      textarea {
        padding: $spacing-sm $spacing-md;
        font-size: $font-size-sm;
      }
    }
  }

  .contact-info {
    h3 {
      font-size: $font-size-xl;
    }

    .info-item {
      .info-icon {
        width: 40px;
        height: 40px;
        font-size: 18px;
      }

      .info-content {
        .info-value {
          font-size: $font-size-sm;
        }
      }
    }
  }
}
</style>
