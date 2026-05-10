<script setup lang="ts">
interface Session {
  id: string
  code: string
  className: string
  createdAt: number
  isActive: boolean
}

interface Record {
  id: string
  sessionId: string
  studentName: string
  checkedInAt: number
}

const className = ref('')
const sessions = ref<Session[]>([])
const currentSession = ref<Session | null>(null)
const currentRecords = ref<Record[]>([])
const isLoading = ref(false)
const error = ref('')
const refreshInterval = ref<ReturnType<typeof setInterval> | null>(null)

function formatTime(timestamp: number): string {
  const date = new Date(timestamp)
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}

async function createSession() {
  if (!className.value.trim()) {
    error.value = '请输入课程名称'
    return
  }
  
  isLoading.value = true
  error.value = ''
  
  try {
    const res = await $fetch('/api/session/create', {
      method: 'POST',
      body: { className: className.value.trim() }
    })
    
    if (res.success) {
      className.value = ''
      await loadSessions()
      await selectSession(res.session.id)
    }
  } catch (e: any) {
    error.value = e.data?.statusMessage || '创建失败'
  } finally {
    isLoading.value = false
  }
}

async function loadSessions() {
  try {
    const res = await $fetch('/api/session/list')
    if (res.success) {
      sessions.value = res.sessions
    }
  } catch (e) {
    console.error('加载会话失败', e)
  }
}

async function selectSession(sessionId: string) {
  stopRefresh()
  
  const session = sessions.value.find(s => s.id === sessionId)
  currentSession.value = session || null
  
  if (session) {
    await loadRecords(sessionId)
    
    if (session.isActive) {
      startRefresh(sessionId)
    }
  } else {
    currentRecords.value = []
  }
}

async function loadRecords(sessionId: string) {
  try {
    const res = await $fetch('/api/records', {
      query: { sessionId }
    })
    if (res.success) {
      currentRecords.value = res.records
    }
  } catch (e) {
    console.error('加载记录失败', e)
  }
}

async function closeSession() {
  if (!currentSession.value) return
  
  try {
    const res = await $fetch('/api/session/close', {
      method: 'POST',
      body: { sessionId: currentSession.value.id }
    })
    
    if (res.success) {
      stopRefresh()
      await loadSessions()
      currentSession.value = sessions.value.find(s => s.id === currentSession.value?.id) || null
    }
  } catch (e: any) {
    error.value = e.data?.statusMessage || '关闭失败'
  }
}

function startRefresh(sessionId: string) {
  refreshInterval.value = setInterval(async () => {
    await loadRecords(sessionId)
  }, 3000)
}

function stopRefresh() {
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value)
    refreshInterval.value = null
  }
}

function exportRecords() {
  if (!currentSession.value) return
  window.location.href = `/api/export?sessionId=${currentSession.value.id}`
}

function exportAll() {
  window.location.href = '/api/export'
}

onMounted(async () => {
  await loadSessions()
})

onBeforeUnmount(() => {
  stopRefresh()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm">
      <div class="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <NuxtLink to="/" class="text-indigo-600 font-semibold hover:text-indigo-800">
          ← 返回首页
        </NuxtLink>
        <h1 class="text-xl font-bold text-gray-800">老师端 - 签到管理</h1>
        <div class="w-24"></div>
      </div>
    </header>

    <div class="max-w-6xl mx-auto px-4 py-6">
      <div class="grid lg:grid-cols-3 gap-6">
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 class="text-lg font-semibold mb-4 text-gray-800">创建签到</h2>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  课程名称
                </label>
                <input
                  v-model="className"
                  type="text"
                  placeholder="例如：高等数学"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  @keyup.enter="createSession"
                />
              </div>
              
              <button
                @click="createSession"
                :disabled="isLoading"
                class="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {{ isLoading ? '创建中...' : '生成签到码' }}
              </button>
              
              <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold text-gray-800">签到历史</h2>
              <button
                @click="loadSessions"
                class="text-indigo-600 text-sm hover:text-indigo-800"
              >
                刷新
              </button>
            </div>
            
            <div v-if="sessions.length === 0" class="text-gray-500 text-center py-4">
              暂无签到记录
            </div>
            
            <div v-else class="space-y-2">
              <div
                v-for="session in sessions"
                :key="session.id"
                @click="selectSession(session.id)"
                :class="[
                  'p-3 rounded-lg cursor-pointer border transition-colors',
                  currentSession?.id === session.id
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-300'
                ]"
              >
                <div class="flex items-center justify-between">
                  <span class="font-medium text-gray-800">{{ session.className }}</span>
                  <span
                    :class="[
                      'text-xs px-2 py-1 rounded-full',
                      session.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    ]"
                  >
                    {{ session.isActive ? '进行中' : '已结束' }}
                  </span>
                </div>
                <div class="text-sm text-gray-500 mt-1">
                  签到码: <span class="font-mono font-semibold">{{ session.code }}</span>
                </div>
              </div>
            </div>
            
            <button
              @click="exportAll"
              class="w-full mt-4 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors text-sm"
            >
              导出全部记录
            </button>
          </div>
        </div>

        <div class="lg:col-span-2">
          <div v-if="!currentSession" class="bg-white rounded-lg shadow-sm p-8 text-center">
            <div class="text-5xl mb-4">👨‍🏫</div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">选择一个签到</h3>
            <p class="text-gray-500">请从左侧创建或选择一个签到会话</p>
          </div>

          <div v-else class="space-y-6">
            <div class="bg-white rounded-lg shadow-sm p-6">
              <div class="flex items-start justify-between mb-4">
                <div>
                  <h2 class="text-xl font-bold text-gray-800">{{ currentSession.className }}</h2>
                  <p class="text-gray-500 text-sm mt-1">
                    创建于 {{ new Date(currentSession.createdAt).toLocaleString('zh-CN') }}
                  </p>
                </div>
                <span
                  :class="[
                    'text-sm px-3 py-1 rounded-full',
                    currentSession.isActive
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  ]"
                >
                  {{ currentSession.isActive ? '进行中' : '已结束' }}
                </span>
              </div>

              <div class="bg-indigo-50 rounded-lg p-6 text-center mb-4">
                <p class="text-sm text-indigo-600 mb-2">签到码</p>
                <div class="text-5xl font-bold tracking-widest font-mono text-indigo-800">
                  {{ currentSession.code }}
                </div>
              </div>

              <div class="flex gap-3">
                <button
                  v-if="currentSession.isActive"
                  @click="closeSession"
                  class="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
                >
                  结束签到
                </button>
                <button
                  @click="exportRecords"
                  class="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  导出本次记录
                </button>
              </div>
            </div>

            <div class="bg-white rounded-lg shadow-sm p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-800">
                  签到名单
                  <span class="text-indigo-600 ml-2">({{ currentRecords.length }}人)</span>
                </h3>
                <span v-if="currentSession.isActive" class="text-sm text-gray-500">
                  自动刷新中...
                </span>
              </div>

              <div v-if="currentRecords.length === 0" class="text-center py-8 text-gray-500">
                <div class="text-4xl mb-2">📝</div>
                <p>暂无学生签到</p>
              </div>

              <div v-else class="overflow-x-auto">
                <table class="w-full">
                  <thead>
                    <tr class="border-b border-gray-200">
                      <th class="text-left py-3 px-4 text-sm font-semibold text-gray-600">#</th>
                      <th class="text-left py-3 px-4 text-sm font-semibold text-gray-600">昵称</th>
                      <th class="text-left py-3 px-4 text-sm font-semibold text-gray-600">签到时间</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(record, index) in currentRecords.slice().reverse()"
                      :key="record.id"
                      class="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td class="py-3 px-4 text-gray-500">{{ index + 1 }}</td>
                      <td class="py-3 px-4 font-medium text-gray-800">{{ record.studentName }}</td>
                      <td class="py-3 px-4 text-gray-600">{{ formatTime(record.checkedInAt) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
