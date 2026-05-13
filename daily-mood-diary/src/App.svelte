<script>
  import MoodSelector from './lib/MoodSelector.svelte';
  import MoodCalendar from './lib/MoodCalendar.svelte';
  import MoodStats from './lib/MoodStats.svelte';

  let currentMonth = new Date();
  let selectedDate = formatDate(new Date());
  let selectedMood = null;
  let note = '';
  let activeTab = 'record';

  function formatDate(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  function handleDateSelect(date) {
    selectedDate = date;
    selectedMood = null;
    note = '';
  }

  function selectToday() {
    selectedDate = formatDate(new Date());
    currentMonth = new Date();
    selectedMood = null;
    note = '';
  }
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
  <div class="max-w-4xl mx-auto px-4 py-8">
    <header class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">
        💜 心情日记
      </h1>
      <p class="text-gray-500">记录每一天的心情与故事</p>
    </header>

    <div class="flex justify-center gap-2 mb-6">
      <button
        on:click={() => activeTab = 'record'}
        class="px-6 py-2 rounded-full font-medium transition-all duration-200 {activeTab === 'record' ? 'bg-blue-500 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100'}"
      >
        记录心情
      </button>
      <button
        on:click={() => activeTab = 'calendar'}
        class="px-6 py-2 rounded-full font-medium transition-all duration-200 {activeTab === 'calendar' ? 'bg-blue-500 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100'}"
      >
        心情日历
      </button>
      <button
        on:click={() => activeTab = 'stats'}
        class="px-6 py-2 rounded-full font-medium transition-all duration-200 {activeTab === 'stats' ? 'bg-blue-500 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100'}"
      >
        月度统计
      </button>
    </div>

    <div class="text-center mb-6">
      <button
        on:click={selectToday}
        class="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors shadow-sm"
      >
        📅 回到今天
      </button>
    </div>

    {#if activeTab === 'record'}
      <MoodSelector 
        bind:selectedDate 
        bind:selectedMood 
        bind:note 
      />
    {:else if activeTab === 'calendar'}
      <MoodCalendar 
        bind:currentMonth 
        bind:selectedDate 
        onDateSelect={handleDateSelect}
      />
    {:else}
      <MoodStats bind:currentMonth />
    {/if}
  </div>
</div>
