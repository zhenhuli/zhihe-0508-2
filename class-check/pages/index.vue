<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
    <div class="max-w-4xl mx-auto">
      <header class="text-center mb-8 py-6">
        <h1 class="text-3xl font-bold text-indigo-800 mb-2">课堂签到系统</h1>
        <p class="text-gray-600">简单、快速、高效的课堂签到解决方案</p>
      </header>

      <div class="grid md:grid-cols-2 gap-6">
        <NuxtLink
          to="/teacher"
          class="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all transform hover:-translate-y-1 text-center block"
        >
          <div class="text-5xl mb-4">👨‍🏫</div>
          <h2 class="text-xl font-semibold text-gray-800 mb-2">老师端</h2>
          <p class="text-gray-600">创建签到码，查看签到名单，导出记录</p>
        </NuxtLink>

        <NuxtLink
          to="/student"
          class="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all transform hover:-translate-y-1 text-center block"
        >
          <div class="text-5xl mb-4">🎓</div>
          <h2 class="text-xl font-semibold text-gray-800 mb-2">学生端</h2>
          <p class="text-gray-600">输入签到码和昵称，快速完成签到</p>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
