<script setup lang="ts">
const { loadFromStorage } = useVocab()

onMounted(() => {
  loadFromStorage()
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <h1 class="text-2xl font-bold text-indigo-600">📚 多语言单词本</h1>
      </div>
    </header>
    <main class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <NuxtPage />
    </main>
  </div>
</template>
