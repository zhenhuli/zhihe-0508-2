<script setup lang="ts">
const { currentLanguage, LANGUAGES, getChaptersByLanguage, addChapter, deleteChapter, importPresets } = useVocab()

const showAddChapter = ref(false)
const newChapterName = ref('')
const newChapterDesc = ref('')

const chapters = computed(() => getChaptersByLanguage(currentLanguage.value))

const handleAddChapter = () => {
  if (newChapterName.value.trim()) {
    addChapter({
      name: newChapterName.value.trim(),
      description: newChapterDesc.value.trim(),
      language: currentLanguage.value,
    })
    newChapterName.value = ''
    newChapterDesc.value = ''
    showAddChapter.value = false
  }
}

const navigateToChapter = (chapterId: string) => {
  navigateTo(`/chapter/${chapterId}`)
}

const navigateToStudy = () => {
  navigateTo('/study')
}
</script>

<template>
  <div class="space-y-6">
    <div class="bg-white rounded-xl shadow p-6">
      <h2 class="text-lg font-semibold mb-4">选择语言</h2>
      <div class="flex flex-wrap gap-3">
        <button
          v-for="lang in LANGUAGES"
          :key="lang.code"
          @click="currentLanguage = lang.code"
          :class="[
            'px-4 py-2 rounded-lg font-medium transition-all',
            currentLanguage === lang.code
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
        >
          {{ lang.flag }} {{ lang.name }}
        </button>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">章节列表</h2>
        <div class="flex gap-3">
          <button
            @click="importPresets()"
            class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            📚 导入预设词汇
          </button>
          <button
            @click="showAddChapter = !showAddChapter"
            class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            + 添加章节
          </button>
        </div>
      </div>

      <div v-if="showAddChapter" class="mb-6 p-4 bg-gray-50 rounded-lg">
        <div class="space-y-3">
          <input
            v-model="newChapterName"
            type="text"
            placeholder="章节名称"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <input
            v-model="newChapterDesc"
            type="text"
            placeholder="章节描述（可选）"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <div class="flex gap-3">
            <button
              @click="handleAddChapter"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              确认添加
            </button>
            <button
              @click="showAddChapter = false"
              class="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors"
            >
              取消
            </button>
          </div>
        </div>
      </div>

      <div v-if="chapters.length === 0" class="text-center py-12 text-gray-500">
        暂无章节，请点击上方按钮添加
      </div>

      <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="chapter in chapters"
          :key="chapter.id"
          class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div class="flex justify-between items-start mb-2">
            <h3 class="font-semibold text-gray-900">{{ chapter.name }}</h3>
            <button
              @click="deleteChapter(chapter.id)"
              class="text-red-500 hover:text-red-700 text-sm"
            >
              删除
            </button>
          </div>
          <p v-if="chapter.description" class="text-sm text-gray-500 mb-3">
            {{ chapter.description }}
          </p>
          <div class="flex gap-2">
            <button
              @click="navigateToChapter(chapter.id)"
              class="flex-1 px-3 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors text-sm font-medium"
            >
              管理单词
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="chapters.length > 0" class="text-center">
      <button
        @click="navigateToStudy"
        class="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
      >
        🎯 开始学习
      </button>
    </div>
  </div>
</template>
