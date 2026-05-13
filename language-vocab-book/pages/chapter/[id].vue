<script setup lang="ts">
const route = useRoute()
const chapterId = route.params.id as string

const { chapters, getWordsByChapter, addWord, updateWord, deleteWord, toggleMemorized, speak, currentLanguage } = useVocab()

const showAddWord = ref(false)
const editingWord = ref<string | null>(null)

const newWord = ref('')
const newPronunciation = ref('')
const newDefinition = ref('')
const newExample = ref('')

const chapter = computed(() => chapters.value.find(c => c.id === chapterId))
const words = computed(() => getWordsByChapter(chapterId))

const resetForm = () => {
  newWord.value = ''
  newPronunciation.value = ''
  newDefinition.value = ''
  newExample.value = ''
  editingWord.value = null
  showAddWord.value = false
}

const handleAddWord = () => {
  if (!newWord.value.trim()) {
    alert('请输入单词')
    return
  }
  if (!newDefinition.value.trim()) {
    alert('请输入释义')
    return
  }
  addWord({
    word: newWord.value.trim(),
    pronunciation: newPronunciation.value.trim(),
    definition: newDefinition.value.trim(),
    example: newExample.value.trim(),
    chapterId,
    language: currentLanguage.value,
  })
  resetForm()
}

const startEdit = (word: any) => {
  editingWord.value = word.id
  newWord.value = word.word
  newPronunciation.value = word.pronunciation
  newDefinition.value = word.definition
  newExample.value = word.example
  showAddWord.value = true
}

const handleUpdateWord = () => {
  if (!editingWord.value) {
    alert('编辑状态错误，请重试')
    return
  }
  if (!newWord.value.trim()) {
    alert('请输入单词')
    return
  }
  if (!newDefinition.value.trim()) {
    alert('请输入释义')
    return
  }
  updateWord(editingWord.value, {
    word: newWord.value.trim(),
    pronunciation: newPronunciation.value.trim(),
    definition: newDefinition.value.trim(),
    example: newExample.value.trim(),
  })
  resetForm()
}

const goBack = () => {
  navigateTo('/')
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center gap-4">
      <button
        @click="goBack"
        class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
      >
        ← 返回
      </button>
      <h1 class="text-2xl font-bold text-gray-900">
        {{ chapter?.name || '章节不存在' }}
      </h1>
    </div>

    <div v-if="chapter" class="bg-white rounded-xl shadow p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">单词列表 ({{ words.length }})</h2>
        <button
          @click="resetForm; showAddWord = !showAddWord"
          class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          + 添加单词
        </button>
      </div>

      <div v-if="showAddWord" class="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 class="font-medium mb-3">{{ editingWord ? '编辑单词' : '添加新单词' }}</h3>
        <div class="space-y-3">
          <div class="grid gap-3 md:grid-cols-2">
            <input
              v-model="newWord"
              type="text"
              placeholder="单词 *"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <input
              v-model="newPronunciation"
              type="text"
              placeholder="发音（可选）"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <input
            v-model="newDefinition"
            type="text"
            placeholder="释义 *"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <input
            v-model="newExample"
            type="text"
            placeholder="例句（可选）"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <div class="flex gap-3">
            <button
              @click="editingWord ? handleUpdateWord() : handleAddWord()"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              {{ editingWord ? '保存修改' : '添加单词' }}
            </button>
            <button
              @click="resetForm"
              class="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors"
            >
              取消
            </button>
          </div>
        </div>
      </div>

      <div v-if="words.length === 0" class="text-center py-12 text-gray-500">
        暂无单词，请点击上方按钮添加
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="word in words"
          :key="word.id"
          :class="[
            'border rounded-lg p-4 transition-all',
            word.memorized ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
          ]"
        >
          <div class="flex justify-between items-start gap-4">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <h3 class="text-xl font-semibold text-gray-900">{{ word.word }}</h3>
                <button
                  @click="speak(word.word, word.language)"
                  class="p-1 text-indigo-600 hover:text-indigo-800"
                  title="发音"
                >
                  🔊
                </button>
                <span v-if="word.pronunciation" class="text-sm text-gray-500">
                  [{{ word.pronunciation }}]
                </span>
                <span
                  v-if="word.memorized"
                  class="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                >
                  已记住
                </span>
              </div>
              <p class="text-gray-700 mb-2">{{ word.definition }}</p>
              <p v-if="word.example" class="text-sm text-gray-500 italic">
                例句: {{ word.example }}
              </p>
            </div>
            <div class="flex flex-col gap-2">
              <button
                @click="startEdit(word)"
                class="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm"
              >
                编辑
              </button>
              <button
                @click="toggleMemorized(word.id)"
                :class="[
                  'px-3 py-1 rounded text-sm',
                  word.memorized
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                ]"
              >
                {{ word.memorized ? '取消记住' : '标记记住' }}
              </button>
              <button
                @click="deleteWord(word.id)"
                class="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
