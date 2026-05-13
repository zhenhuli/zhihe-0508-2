<script>
  import { MOODS, diaryStore } from './store.js';

  export let currentMonth = new Date();
  export let selectedDate;
  export let onDateSelect;

  const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

  function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }

  function getFirstDayOfMonth(year, month) {
    return new Date(year, month, 1).getDay();
  }

  function formatDate(year, month, day) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  function prevMonth() {
    currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
  }

  function nextMonth() {
    currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
  }

  $: year = currentMonth.getFullYear();
  $: month = currentMonth.getMonth();
  $: daysInMonth = getDaysInMonth(year, month);
  $: firstDay = getFirstDayOfMonth(year, month);
  $: monthEntries = diaryStore.getMonthEntries(year, month);
</script>

<div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
  <div class="flex items-center justify-between mb-6">
    <button on:click={prevMonth} class="p-2 hover:bg-gray-100 rounded-full transition-colors">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
    <h2 class="text-xl font-bold text-gray-800">
      {year}年{month + 1}月
    </h2>
    <button on:click={nextMonth} class="p-2 hover:bg-gray-100 rounded-full transition-colors">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </div>

  <div class="grid grid-cols-7 gap-2 mb-2">
    {#each WEEKDAYS as day}
      <div class="text-center text-sm font-medium text-gray-500 py-2">{day}</div>
    {/each}
  </div>

  <div class="grid grid-cols-7 gap-2">
    {#each Array(firstDay) as _}
      <div class="aspect-square"></div>
    {/each}

    {#each Array(daysInMonth) as _, i}
      {@const day = i + 1}
      {@const dateStr = formatDate(year, month, day)}
      {@const entry = monthEntries[dateStr]}
      {@const mood = entry ? MOODS.find(m => m.id === entry.mood) : null}

      <button
        on:click={() => onDateSelect(dateStr)}
        class="aspect-square rounded-xl flex flex-col items-center justify-center transition-all duration-200 hover:scale-105 {selectedDate === dateStr ? 'ring-2 ring-blue-400' : ''}"
        style="background-color: {mood ? mood.color + '20' : '#f9fafb'}"
      >
        <span class="text-sm font-medium {mood ? '' : 'text-gray-600'}">{day}</span>
        {#if mood}
          <span class="text-lg">{mood.emoji}</span>
        {/if}
      </button>
    {/each}
  </div>
</div>
