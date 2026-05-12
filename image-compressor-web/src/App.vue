<script setup>
import { ref } from 'vue'
import ImageUpload from './components/ImageUpload.vue'
import ImageCompressor from './components/ImageCompressor.vue'
import ImagePreview from './components/ImagePreview.vue'

const originalImage = ref(null)
const compressedImage = ref(null)
const imageName = ref('')

const handleImageSelected = (imageData) => {
  originalImage.value = imageData
  imageName.value = imageData.name
  compressedImage.value = null
}

const handleCompressed = (compressedData) => {
  compressedImage.value = compressedData
}
</script>

<template>
  <div class="app">
    <header class="app-header">
      <h1>🖼️ 在线图片压缩工具</h1>
      <p>快速压缩图片，保持画质，减小文件体积</p>
    </header>
    <main class="app-main">
      <div class="upload-section">
        <ImageUpload @image-selected="handleImageSelected" />
      </div>
      <div class="content-section" v-if="originalImage">
        <div class="compressor-wrapper">
          <ImageCompressor
            :image-file="originalImage"
            @compressed="handleCompressed"
          />
        </div>
        <div class="preview-wrapper">
          <ImagePreview
            :original-image="originalImage"
            :compressed-image="compressedImage"
            :original-name="imageName"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.app {
  min-height: 100vh;
  padding: 20px;
}

.app-header {
  text-align: center;
  color: #fff;
  margin-bottom: 40px;
}

.app-header h1 {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 8px;
}

.app-header p {
  font-size: 16px;
  opacity: 0.9;
}

.app-main {
  max-width: 1000px;
  margin: 0 auto;
}

.upload-section {
  margin-bottom: 30px;
}

.content-section {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.compressor-wrapper,
.preview-wrapper {
  width: 100%;
}
</style>
