<script>
  import { onMount, onDestroy } from 'svelte';
  import Chart from 'chart.js/auto';
  import { MOODS, diaryStore } from './store.js';

  export let currentMonth = new Date();

  let chartCanvas;
  let chart;

  $: year = currentMonth.getFullYear();
  $: month = currentMonth.getMonth();
  $: monthEntries = diaryStore.getMonthEntries(year, month);
  $: moodStats = calculateMoodStats(monthEntries);
  $: mostMood = getMostFrequentMood();

  function calculateMoodStats(entries) {
    const stats = {};
    MOODS.forEach(mood => {
      stats[mood.id] = 0;
    });
    
    Object.values(entries).forEach(entry => {
      if (stats[entry.mood] !== undefined) {
        stats[entry.mood]++;
      }
    });
    
    return stats;
  }

  function getTotalDays() {
    return Object.values(moodStats).reduce((a, b) => a + b, 0);
  }

  function getMostFrequentMood() {
    let max = 0;
    let moodId = null;
    Object.entries(moodStats).forEach(([id, count]) => {
      if (count > max) {
        max = count;
        moodId = id;
      }
    });
    return moodId ? MOODS.find(m => m.id === moodId) : null;
  }

  onMount(() => {
    createChart();
  });

  $: if (chart && moodStats) {
    updateChart();
  }

  function createChart() {
    const ctx = chartCanvas.getContext('2d');
    chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: MOODS.map(m => m.label),
        datasets: [{
          data: MOODS.map(m => moodStats[m.id] || 0),
          backgroundColor: MOODS.map(m => m.color),
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 15,
              usePointStyle: true,
              font: {
                size: 12
              }
            }
          }
        },
        cutout: '60%'
      }
    });
  }

  function updateChart() {
    chart.data.datasets[0].data = MOODS.map(m => moodStats[m.id] || 0);
    chart.update();
  }

  onDestroy(() => {
    if (chart) {
      chart.destroy();
    }
  });
</script>

<div class="bg-white rounded-2xl shadow-lg p-6">
  <h2 class="text-xl font-bold text-gray-800 mb-6">
    {year}年{month + 1}月 心情统计
  </h2>

  <div class="grid md:grid-cols-2 gap-6">
    <div class="h-64">
      <canvas bind:this={chartCanvas}></canvas>
    </div>

    <div class="space-y-4">
      <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
        <div class="text-sm text-gray-500 mb-1">本月记录天数</div>
        <div class="text-3xl font-bold text-gray-800">{getTotalDays()} 天</div>
      </div>

      {#if mostMood}
        <div class="rounded-xl p-4" style="background-color: {mostMood.color}20">
          <div class="text-sm text-gray-500 mb-1">本月最常出现的心情</div>
          <div class="flex items-center gap-2">
            <span class="text-3xl">{mostMood.emoji}</span>
            <span class="text-xl font-bold" style="color: {mostMood.color}">{mostMood.label}</span>
            <span class="text-gray-500">({moodStats[mostMood.id]} 天)</span>
          </div>
        </div>
      {/if}

      <div class="space-y-2">
        {#each MOODS as mood}
          {#if moodStats[mood.id] > 0}
            <div class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
              <span class="text-xl">{mood.emoji}</span>
              <span class="flex-1 text-gray-600">{mood.label}</span>
              <div class="flex items-center gap-2">
                <div class="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    class="h-full rounded-full transition-all duration-500"
                    style="width: {getTotalDays() > 0 ? (moodStats[mood.id] / getTotalDays() * 100) : 0}%; background-color: {mood.color}"
                  ></div>
                </div>
                <span class="text-sm font-medium text-gray-500 w-12 text-right">{moodStats[mood.id]} 天</span>
              </div>
            </div>
          {/if}
        {/each}
      </div>
    </div>
  </div>
</div>
