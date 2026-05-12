<script setup>
import { ref, computed } from 'vue'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

const files = ref([])
const prefix = ref('')
const startNumber = ref(1)
const numberDigits = ref(3)
const findText = ref('')
const replaceText = ref('')
const dragOver = ref(false)

const processedFiles = computed(() => {
  return files.value.map((file, index) => {
    const originalName = file.name
    const lastDotIndex = originalName.lastIndexOf('.')
    const name = lastDotIndex > 0 ? originalName.substring(0, lastDotIndex) : originalName
    const ext = lastDotIndex > 0 ? originalName.substring(lastDotIndex) : ''
    
    let newName = name
    
    if (findText.value) {
      newName = newName.split(findText.value).join(replaceText.value)
    }
    
    if (prefix.value) {
      const num = (startNumber.value + index).toString().padStart(numberDigits.value, '0')
      newName = `${prefix.value}${num}_${newName}`
    }
    
    newName = newName + ext
    
    return {
      original: originalName,
      new: newName,
      file: file,
      id: file.uid
    }
  })
})

const hasChanges = computed(() => {
  return processedFiles.value.some(f => f.original !== f.new)
})

const handleFileUpload = (uploadFiles) => {
  const fileList = Array.from(uploadFiles)
  fileList.forEach(f => {
    f.uid = Date.now() + Math.random()
  })
  files.value = [...files.value, ...fileList]
}

const handleDrop = (e) => {
  e.preventDefault()
  dragOver.value = false
  if (e.dataTransfer.files) {
    handleFileUpload(e.dataTransfer.files)
  }
}

const handleDragOver = (e) => {
  e.preventDefault()
  dragOver.value = true
}

const handleDragLeave = () => {
  dragOver.value = false
}

const removeFile = (uid) => {
  files.value = files.value.filter(f => f.uid !== uid)
}

const clearAll = () => {
  files.value = []
}

const downloadAll = async () => {
  if (processedFiles.value.length === 0) return
  
  const zip = new JSZip()
  
  processedFiles.value.forEach(item => {
    zip.file(item.new, item.file)
  })
  
  const content = await zip.generateAsync({ type: 'blob' })
  saveAs(content, 'renamed_files.zip')
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>

<template>
  <div class="app-container">
    <el-card class="header-card">
      <template #header>
        <div class="card-header">
          <el-icon size="32" color="#409eff"><DocumentCopy /></el-icon>
          <h1>在线批量文件重命名工具</h1>
        </div>
      </template>
      <p class="description">支持多文件上传、自定义前缀编号、批量替换文件名、预览效果、打包下载</p>
    </el-card>

    <el-row :gutter="20" class="main-row">
      <el-col :xs="24" :sm="24" :md="14" :lg="14" :xl="14">
        <el-card class="upload-card">
          <template #header>
            <div class="card-header">
              <span>文件列表</span>
              <el-button type="danger" size="small" @click="clearAll" :disabled="files.length === 0">
                <el-icon><Delete /></el-icon>
                清空全部
              </el-button>
            </div>
          </template>
          
          <div 
            class="upload-area"
            :class="{ 'drag-over': dragOver }"
            @drop="handleDrop"
            @dragover="handleDragOver"
            @dragleave="handleDragLeave"
          >
            <el-upload
              ref="upload"
              class="upload-dragger"
              drag
              multiple
              :auto-upload="false"
              :show-file-list="false"
              :on-change="(file) => handleFileUpload([file.raw])"
            >
              <el-icon class="el-icon--upload"><upload-filled /></el-icon>
              <div class="el-upload__text">
                将文件拖到此处，或<em>点击上传</em>
              </div>
              <template #tip>
                <div class="el-upload__tip">
                  支持多文件同时上传，文件大小不超过 10MB
                </div>
              </template>
            </el-upload>
          </div>

          <div v-if="files.length > 0" class="file-list">
            <div class="list-header">
              <span>原文件名</span>
              <span>新文件名</span>
              <span>大小</span>
              <span>操作</span>
            </div>
            <div v-for="item in processedFiles" :key="item.id" class="file-item">
              <div class="original-name" :title="item.original">
                <el-icon><Document /></el-icon>
                {{ item.original }}
              </div>
              <div class="new-name" :class="{ 'changed': item.original !== item.new }" :title="item.new">
                <el-icon v-if="item.original !== item.new" color="#67c23a"><ArrowRight /></el-icon>
                {{ item.new }}
              </div>
              <div class="file-size">{{ formatFileSize(item.file.size) }}</div>
              <div class="file-actions">
                <el-button type="danger" size="small" link @click="removeFile(item.id)">
                  <el-icon><Close /></el-icon>
                </el-button>
              </div>
            </div>
          </div>

          <el-empty v-else description="暂无文件，请上传文件" />
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="24" :md="10" :lg="10" :xl="10">
        <el-card class="settings-card">
          <template #header>
            <div class="card-header">
              <el-icon size="20" color="#409eff"><Setting /></el-icon>
              <span>重命名设置</span>
            </div>
          </template>

          <el-form label-width="100px">
            <el-divider content-position="left">前缀编号设置</el-divider>
            
            <el-form-item label="文件名前缀">
              <el-input 
                v-model="prefix" 
                placeholder="例如: photo_"
                clearable
              />
              <div class="form-tip">留空则不添加前缀</div>
            </el-form-item>

            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item label="起始编号">
                  <el-input-number 
                    v-model="startNumber" 
                    :min="0" 
                    :max="9999"
                    controls-position="right"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="编号位数">
                  <el-input-number 
                    v-model="numberDigits" 
                    :min="1" 
                    :max="6"
                    controls-position="right"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-divider content-position="left">批量替换</el-divider>

            <el-form-item label="查找内容">
              <el-input 
                v-model="findText" 
                placeholder="输入要替换的文字"
                clearable
              />
            </el-form-item>

            <el-form-item label="替换为">
              <el-input 
                v-model="replaceText" 
                placeholder="输入替换后的文字"
                clearable
              />
              <div class="form-tip">留空则删除查找内容</div>
            </el-form-item>
          </el-form>

          <div class="preview-stats">
            <el-statistic title="文件总数" :value="files.length" class="stat-item">
              <template #suffix>个</template>
            </el-statistic>
            <el-statistic title="将修改" :value="processedFiles.filter(f => f.original !== f.new).length" class="stat-item" value-color="#67c23a">
              <template #suffix>个</template>
            </el-statistic>
          </div>

          <div class="action-buttons">
            <el-button 
              type="primary" 
              size="large" 
              @click="downloadAll"
              :disabled="files.length === 0"
              style="width: 100%"
            >
              <el-icon><Download /></el-icon>
              打包下载 ZIP
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.app-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.header-card {
  margin-bottom: 20px;
  text-align: center;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: space-between;
}

.card-header > div:first-child {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-card h1 {
  margin: 0;
  color: #303133;
}

.description {
  margin: 10px 0 0 0;
  color: #606266;
  font-size: 14px;
}

.upload-card,
.settings-card {
  margin-bottom: 20px;
}

.upload-area {
  margin-bottom: 20px;
}

.upload-area.drag-over {
  background-color: #ecf5ff;
}

.upload-dragger {
  width: 100%;
}

.file-list {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  overflow: hidden;
}

.list-header {
  display: grid;
  grid-template-columns: 2fr 2fr 1fr 60px;
  background-color: #f5f7fa;
  padding: 12px 15px;
  font-weight: 500;
  font-size: 14px;
  color: #606266;
  border-bottom: 1px solid #ebeef5;
}

.file-item {
  display: grid;
  grid-template-columns: 2fr 2fr 1fr 60px;
  padding: 12px 15px;
  align-items: center;
  border-bottom: 1px solid #ebeef5;
  font-size: 14px;
}

@media (max-width: 768px) {
  .list-header {
    grid-template-columns: 1fr 1fr;
  }
  
  .list-header span:nth-child(3),
  .list-header span:nth-child(4) {
    display: none;
  }
  
  .file-item {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .file-size {
    text-align: left !important;
    padding-right: 0 !important;
    font-size: 12px;
  }
  
  .file-actions {
    text-align: right;
    position: absolute;
    right: 15px;
    top: 12px;
  }
  
  .file-item {
    position: relative;
    padding-right: 50px;
  }
}

.file-item:last-child {
  border-bottom: none;
}

.file-item:hover {
  background-color: #f5f7fa;
}

.original-name,
.new-name {
  display: flex;
  align-items: center;
  gap: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.new-name.changed {
  color: #67c23a;
  font-weight: 500;
}

.file-size {
  color: #909399;
  text-align: right;
  padding-right: 10px;
}

.file-actions {
  text-align: center;
}

.form-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}

.preview-stats {
  display: flex;
  justify-content: space-around;
  padding: 20px 0;
  border-top: 1px solid #ebeef5;
  margin-top: 20px;
}

.stat-item {
  text-align: center;
}

.action-buttons {
  margin-top: 20px;
}

@media (max-width: 768px) {
  .app-container {
    padding: 10px;
  }
  
  .header-card h1 {
    font-size: 24px;
  }
  
  .description {
    font-size: 12px;
  }
  
  .card-header {
    flex-wrap: wrap;
    gap: 10px;
  }
  
  .main-row {
    display: flex;
    flex-direction: column;
  }
  
  .upload-card,
  .settings-card {
    margin-bottom: 15px;
  }
  
  .original-name,
  .new-name {
    font-size: 13px;
  }
  
  .new-name {
    padding-left: 24px;
  }
  
  .new-name .el-icon {
    margin-left: -24px;
  }
}

@media (max-width: 480px) {
  .app-container {
    padding: 8px;
  }
  
  .header-card h1 {
    font-size: 20px;
  }
  
  .header-card .el-icon {
    font-size: 24px !important;
  }
}
</style>
