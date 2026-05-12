<template>
  <div class="compressor-container">
    <div class="mode-tabs">
      <button
        class="tab-btn"
        :class="{ active: compressionMode === 'quality' }"
        @click="compressionMode = 'quality'"
      >
        质量压缩
      </button>
      <button
        class="tab-btn"
        :class="{ active: compressionMode === 'size' }"
        @click="compressionMode = 'size'"
      >
        尺寸压缩
      </button>
    </div>

    <div class="quality-control" v-if="compressionMode === 'quality'">
      <label class="quality-label">压缩质量: {{ quality }}%</label>
      <input
        type="range"
        v-model.number="quality"
        min="10"
        max="100"
        step="5"
        @input="handleQualityChange"
        class="quality-slider"
      />
    </div>

    <div class="size-control" v-if="compressionMode === 'size'">
      <div class="size-input-group">
        <label class="size-label">最大宽度</label>
        <input
          type="number"
          v-model.number="maxWidth"
          min="100"
          max="5000"
          step="10"
          @input="handleSizeChange"
          class="size-input"
        />
        <span class="unit">px</span>
      </div>
      <div class="size-input-group">
        <label class="size-label">最大高度</label>
        <input
          type="number"
          v-model.number="maxHeight"
          min="100"
          max="5000"
          step="10"
          @input="handleSizeChange"
          class="size-input"
        />
        <span class="unit">px</span>
      </div>
    </div>

    <div class="compression-info" v-if="compressionResult">
      <div class="info-item">
        <span class="info-label">原始大小:</span>
        <span class="info-value">{{ formatSize(originalSize) }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">压缩后:</span>
        <span class="info-value">{{ formatSize(compressionResult.size) }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">压缩率:</span>
        <span class="info-value highlight">{{ compressionRate }}%</span>
      </div>
    </div>
    <button
      @click="startCompression"
      :disabled="!imageFile || isCompressing"
      class="compress-btn"
    >
      {{ isCompressing ? '压缩中...' : '开始压缩' }}
    </button>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import imageCompression from 'browser-image-compression'

const props = defineProps({
  imageFile: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['compressed'])

const compressionMode = ref('quality')
const quality = ref(80)
const maxWidth = ref(1920)
const maxHeight = ref(1080)
const isCompressing = ref(false)
const compressionResult = ref(null)
const originalSize = ref(0)

const compressionRate = computed(() => {
  if (!compressionResult.value || !originalSize.value) return 0
  return Math.round((1 - compressionResult.value.size / originalSize.value) * 100)
})

const handleQualityChange = () => {
  if (props.imageFile) {
    startCompression()
  }
}

const handleSizeChange = () => {
  if (props.imageFile) {
    startCompression()
  }
}

const startCompression = async () => {
  if (!props.imageFile) return

  isCompressing.value = true
  originalSize.value = props.imageFile.size

  try {
    let options = {
      useWebWorker: true
    }

    if (compressionMode.value === 'quality') {
      options = {
        ...options,
        initialQuality: quality.value / 100,
        maxWidthOrHeight: 5000
      }
    } else {
      options = {
        ...options,
        maxWidthOrHeight: Math.max(maxWidth.value, maxHeight.value),
        initialQuality: 0.92
      }
    }

    const compressedFile = await imageCompression(props.imageFile.file, options)

    const reader = new FileReader()
    reader.onload = (e) => {
      compressionResult.value = {
        file: compressedFile,
        url: e.target.result,
        size: compressedFile.size
      }
      emit('compressed', compressionResult.value)
      isCompressing.value = false
    }
    reader.readAsDataURL(compressedFile)
  } catch (error) {
    console.error('压缩失败:', error)
    isCompressing.value = false
  }
}

const formatSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

watch(() => props.imageFile, (newVal) => {
  if (newVal) {
    originalSize.value = newVal.size
    startCompression()
  } else {
    compressionResult.value = null
  }
})

watch(compressionMode, () => {
  if (props.imageFile) {
    startCompression()
  }
})
</script>

<style scoped>
.compressor-container {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.mode-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e0e0e0;
}

.tab-btn {
  flex: 1;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  background: #f5f5f5;
  border: 2px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-btn:hover {
  background: #e8e8e8;
}

.tab-btn.active {
  color: #42b883;
  background: #f0fff4;
  border-color: #42b883;
}

.quality-control {
  margin-bottom: 24px;
}

.quality-label {
  display: block;
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 12px;
}

.quality-slider {
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: #e0e0e0;
  outline: none;
  -webkit-appearance: none;
}

.quality-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #42b883;
  cursor: pointer;
  transition: transform 0.2s;
}

.quality-slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
}

.size-control {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
}

.size-input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.size-label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.size-input {
  padding: 10px 12px;
  font-size: 14px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.3s ease;
}

.size-input:focus {
  border-color: #42b883;
}

.unit {
  font-size: 12px;
  color: #666;
  margin-top: -4px;
}

.compression-info {
  display: flex;
  justify-content: space-around;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 24px;
}

.info-item {
  text-align: center;
}

.info-label {
  display: block;
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.info-value {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.info-value.highlight {
  color: #42b883;
}

.compress-btn {
  width: 100%;
  padding: 14px;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  background: #42b883;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.compress-btn:hover:not(:disabled) {
  background: #3aa373;
  transform: translateY(-1px);
}

.compress-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

@media (max-width: 600px) {
  .size-control {
    grid-template-columns: 1fr;
  }
}
</style>
