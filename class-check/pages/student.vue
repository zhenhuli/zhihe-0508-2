<script setup lang="ts">
const code = ref('')
const studentName = ref('')
const isLoading = ref(false)
const error = ref('')
const success = ref(false)

async function doCheckIn() {
  if (!code.value.trim()) {
    error.value = '请输入签到码'
    return
  }
  
  if (!studentName.value.trim()) {
    error.value = '请输入您的昵称'
    return
  }
  
  isLoading.value = true
  error.value = ''
  success.value = false
  
  try {
    const res = await $fetch('/api/checkin', {
      method: 'POST',
      body: {
        code: code.value.trim(),
        studentName: studentName.value.trim()
      }
    })
    
    if (res.success) {
      success.value = true
    }
  } catch (e: any) {
    error.value = e.data?.statusMessage || '签到失败，请重试'
  } finally {
    isLoading.value = false
  }
}

function resetForm() {
  code.value = ''
  studentName.value = ''
  success.value = false
  error.value = ''
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <header class="text-center mb-8">
        <NuxtLink to="/" class="text-teal-600 hover:text-teal-800 text-sm">
          ← 返回首页
        </NuxtLink>
        <div class="text-5xl mb-4 mt-4">🎓</div>
        <h1 class="text-2xl font-bold text-teal-800 mb-2">学生签到</h1>
        <p class="text-gray-600">快速完成课堂签到</p>
      </header>

      <div v-if="success" class="bg-white rounded-xl shadow-lg p-8 text-center">
        <div class="text-6xl mb-4">✅</div>
        <h2 class="text-xl font-bold text-green-600 mb-2">签到成功！</h2>
        <p class="text-gray-600 mb-6">
          <span class="font-semibold">{{ studentName }}</span>，您已成功签到
        </p>
        <button
          @click="resetForm"
          class="w-full bg-teal-600 text-white py-3 px-4 rounded-lg hover:bg-teal-700 transition-colors"
        >
          继续签到（切换账号）
        </button>
      </div>

      <div v-else class="bg-white rounded-xl shadow-lg p-8">
        <form @submit.prevent="doCheckIn" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              签到码
            </label>
            <input
              v-model="code"
              type="text"
              placeholder="请输入6位签到码"
              maxlength="6"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-center text-2xl font-mono tracking-widest"
              :disabled="isLoading"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              您的昵称
            </label>
            <input
              v-model="studentName"
              type="text"
              placeholder="请输入您的姓名或昵称"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              :disabled="isLoading"
            />
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-teal-600 text-white py-3 px-4 rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {{ isLoading ? '签到中...' : '立即签到' }}
          </button>

          <p v-if="error" class="text-red-500 text-center text-sm">
            {{ error }}
          </p>
        </form>

        <div class="mt-6 pt-6 border-t border-gray-100">
          <p class="text-xs text-gray-500 text-center">
            提示：签到码由老师创建，请确保输入正确的6位数字签到码
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
