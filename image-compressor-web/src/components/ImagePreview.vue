<template>
  <div class="preview-container">
    <div class="preview-header">
      <h3>压缩前后对比</h3>
      <button
        v-if="compressedImage"
        @click="downloadImage"
        class="download-btn"
      >
        📥 下载图片
      </button>
    </div>
    <div class="preview-grid">
      <div class="preview-card">
        <div class="card-header">原图</div>
        <div class="image-wrapper" v-if="originalImage">
          <img :src="originalImage.url" alt="原图" class="preview-image" />
        </div>
        <div class="placeholder" v-else>
          <span>暂无图片</span>
        </div>
      </div>
      <div class="preview-card">
        <div class="card-header">压缩后</div>
        <div class="image-wrapper" v-if="compressedImage">
          <img :src="compressedImage.url" alt="压缩后" class="preview-image" />
        </div>
        <div class="placeholder" v-else>
          <span>等待压缩</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  originalImage: {
    type: Object,
    default: null
  },
  compressedImage: {
    type: Object,
    default: null
  },
  originalName: {
    type: String,
    default: 'compressed-image'
  }
})

const downloadImage = () => {
  if (!props.compressedImage) return

  const link = document.createElement('a')
  link.href = props.compressedImage.url
  const nameParts = props.originalName.split('.')
  nameParts[0] = nameParts[0] + '_compressed'
  link.download = nameParts.join('.')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<style scoped>
.preview-container {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.preview-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.download-btn {
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  background: #42b883;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.download-btn:hover {
  background: #3aa373;
  transform: translateY(-1px);
}

.preview-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.preview-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.card-header {
  padding: 12px;
  background: #f8f9fa;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  text-align: center;
  border-bottom: 1px solid #e0e0e0;
}

.image-wrapper {
  width: 100%;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fafafa;
  overflow: hidden;
}

.preview-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.placeholder {
  width: 100%;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fafafa;
  color: #999;
  font-size: 14px;
}
</style>
