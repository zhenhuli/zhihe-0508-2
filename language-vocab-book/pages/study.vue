<script setup lang="ts">
const { words, chapters, currentLanguage, getWordsByChapter, getChaptersByLanguage, speak, toggleMemorized } = useVocab()

const selectedChapterId = ref<string>('')
const showDefinition = ref(false)
const currentIndex = ref(0)

const languageChapters = computed(() => getChaptersByLanguage(currentLanguage.value))
const studyWords = computed(() => {
  if (selectedChapterId.value) {
    return getWordsByChapter(selectedChapterId.value)
  }
  return words.value.filter(w => w.language === currentLanguage.value && !w.memorized)
})

const currentWord = computed(() => studyWords.value[currentIndex.value])

const shuffledWords = ref<any[]>([])

watch(
  () => [selectedChapterId.value, studyWords.value.length],
  () => {
    shuffledWords.value = [...studyWords.value].sort(() => Math.random() - 0.5)
    currentIndex.value = 0
    showDefinition.value = false
  },
  { immediate: true }
)

const currentShuffledWord = computed(() => shuffledWords.value[currentIndex.value])

const nextWord = () => {
  if (currentIndex.value < shuffledWords.value.length - 1) {
    currentIndex.value++
    showDefinition.value = false
  }
}

const prevWord = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
    showDefinition.value = false
  }
}

const goBack = () => {
  navigateTo('/')
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <button
        @click="goBack"
        class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
      >
        ← 返回
      </button>
      <h1 class="text-2xl font-bold text-gray-900">🎯 学习模式</h1>
      <div class="w-24"></div>
    </div>

    <div class="bg-white rounded-xl shadow p-6">
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">选择章节学习</label>
        <select
          v-model="selectedChapterId"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">全部未记住的单词</option>
          <option v-for="chapter in languageChapters" :key="chapter.id" :value="chapter.id">
            {{ chapter.name }}
          </option>
        </select>
      </div>

      <div v-if="shuffledWords.length === 0" class="text-center py-12">
        <div class="text-6xl mb-4">🎉</div>
        <p class="text-xl text-gray-600">太棒了！没有需要学习的单词了</p>
        <p class="text-gray-500 mt-2">去添加一些新单词吧！</p>
      </div>

      <div v-else class="space-y-6">
        <div class="text-center text-sm text-gray-500">
          进度: {{ currentIndex + 1 }} / {{ shuffledWords.length }}
        </div>

        <div class="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-8 min-h-80 flex flex-col justify-center">
          <div class="text-center space-y-6">
            <div class="flex items-center justify-center gap-3">
              <h2 class="text-4xl font-bold text-gray-900">{{ currentShuffledWord?.word }}</h2>
              <button
                @click="speak(currentShuffledWord?.word || '', currentShuffledWord?.language || 'en')"
                class="p-2 text-indigo-600 hover:text-indigo-800 text-2xl"
                title="发音"
              >
                🔊
              </button>
            </div>
            <p v-if="currentShuffledWord?.pronunciation" class="text-lg text-gray-500">
              [{{ currentShuffledWord.pronunciation }}]
            </p>

            <div v-if="showDefinition" class="space-y-4">
              <p class="text-2xl text-gray-700">{{ currentShuffledWord?.definition }}</p>
              <p v-if="currentShuffledWord?.example" class="text-lg text-gray-500 italic">
                "{{ currentShuffledWord.example }}"
              </p>
            </div>

            <button
              v-if="!showDefinition"
              @click="showDefinition = true"
              class="mt-8 px-8 py-3 bg-indigo-600 text-white rounded-xl font-semibold text-lg hover:bg-indigo-700 transition-colors"
            >
              显示释义
            </button>
          </div>
        </div>

        <div class="flex justify-center gap-4">
          <button
            @click="prevWord"
            :disabled="currentIndex === 0"
            :class="[
              'px-6 py-3 rounded-lg font-medium transition-colors',
              currentIndex === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            ]"
          >
            上一个
          </button>

          <button
            v-if="currentShuffledWord"
            @click="toggleMemorized(currentShuffledWord.id)"
            :class="[
              'px-6 py-3 rounded-lg font-medium transition-colors',
              currentShuffledWord.memorized
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                : 'bg-green-600 text-white hover:bg-green-700'
            ]"
          >
            {{ currentShuffledWord.memorized ? '取消记住' : '✓ 记住了' }}
          </button>

          <button
            @click="nextWord"
            :disabled="currentIndex === shuffledWords.length - 1"
            :class="[
              'px-6 py-3 rounded-lg font-medium transition-colors',
              currentIndex === shuffledWords.length - 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            ]"
          >
            下一个
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
