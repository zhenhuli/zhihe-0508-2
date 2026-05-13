<script>
  import { MOODS, diaryStore } from './store.js';

  export let selectedDate;
  export let selectedMood = null;
  export let note = '';

  function selectMood(moodId) {
    selectedMood = moodId;
  }

  function saveEntry() {
    if (selectedMood) {
      diaryStore.addEntry(selectedDate, selectedMood, note);
      note = '';
    }
  }

  $: existingEntry = $diaryStore[selectedDate];
  $: if (existingEntry) {
    selectedMood = existingEntry.mood;
    note = existingEntry.note;
  }
</script>

<div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
  <h2 class="text-xl font-bold text-gray-800 mb-4">
    {selectedDate} 的心情
  </h2>

  <div class="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
    {#each MOODS as mood}
      <button
        on:click={() => selectMood(mood.id)}
        class="flex flex-col items-center p-3 rounded-xl transition-all duration-200 {selectedMood === mood.id ? 'scale-110 shadow-md' : 'hover:bg-gray-100'}"
        style="background-color: {selectedMood === mood.id ? mood.color + '20' : 'transparent'}; border: 2px solid {selectedMood === mood.id ? mood.color : 'transparent'}"
      >
        <span class="text-3xl mb-1">{mood.emoji}</span>
        <span class="text-sm font-medium text-gray-600">{mood.label}</span>
      </button>
    {/each}
  </div>

  <div class="mb-4">
    <label class="block text-sm font-medium text-gray-700 mb-2">今日心情记录</label>
    <textarea
      bind:value={note}
      placeholder="写下今天的心情和事情..."
      class="w-full h-32 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none"
    ></textarea>
  </div>

  <button
    on:click={saveEntry}
    disabled={!selectedMood}
    class="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    保存心情记录
  </button>
</div>
