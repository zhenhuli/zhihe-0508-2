export const posts = [
  {
    id: 1,
    title: 'Vue 3 组合式 API 实战指南',
    category: 'frontend',
    categoryName: '前端开发',
    date: '2024-05-10',
    readTime: '8 分钟',
    excerpt: '本文将深入探讨 Vue 3 组合式 API 的核心概念和最佳实践，包括 setup 函数、响应式数据、生命周期钩子等内容。',
    tags: ['Vue', 'JavaScript', '前端'],
    content: `
## 什么是组合式 API？

组合式 API 是 Vue 3 引入的一种新的代码组织方式，它允许我们按照逻辑功能来组织代码，而不是按照选项类型。

## setup 函数

setup 函数是组合式 API 的入口点，它在组件创建之前执行，此时组件实例尚未创建。

\`\`\`javascript
import { ref, onMounted } from 'vue'

export default {
  setup() {
    const count = ref(0)
    
    function increment() {
      count.value++
    }
    
    onMounted(() => {
      console.log('组件已挂载')
    })
    
    return { count, increment }
  }
}
\`\`\`

## 响应式数据

Vue 3 提供了两种创建响应式数据的方式：

- \`ref()\` - 用于基本类型
- \`reactive()\` - 用于对象类型

> 组合式 API 让我们能够更好地复用逻辑代码，特别是在处理复杂组件时。

## 总结

组合式 API 是 Vue 3 的一大亮点，它提供了更灵活的代码组织方式，让我们能够构建更可维护的应用。
    `
  },
  {
    id: 2,
    title: 'Node.js 性能优化技巧',
    category: 'backend',
    categoryName: '后端开发',
    date: '2024-05-08',
    readTime: '10 分钟',
    excerpt: '探索 Node.js 应用的性能优化策略，包括事件循环优化、内存管理、异步处理等关键技术。',
    tags: ['Node.js', '后端', '性能优化'],
    content: `
## 理解事件循环

Node.js 使用单线程事件循环模型，理解其工作原理是优化的第一步。

## 避免阻塞操作

任何耗时的同步操作都会阻塞整个事件循环，应该使用异步版本的 API。

\`\`\`javascript
// 不好的做法
const data = fs.readFileSync('large-file.txt')

// 好的做法
fs.readFile('large-file.txt', (err, data) => {
  // 处理数据
})
\`\`\`

## 使用流处理大文件

对于大文件，应该使用流来逐块处理，而不是一次性加载到内存。

## 总结

Node.js 性能优化需要从多个维度考虑，包括代码层面、架构层面和运维层面。
    `
  },
  {
    id: 3,
    title: 'CSS Grid 布局完全教程',
    category: 'frontend',
    categoryName: '前端开发',
    date: '2024-05-05',
    readTime: '12 分钟',
    excerpt: '从基础到高级，全面掌握 CSS Grid 布局系统，构建复杂的响应式页面布局。',
    tags: ['CSS', '布局', '前端'],
    content: `
## Grid 布局基础

CSS Grid 是一个**二维布局系统**，可以同时处理行和列。

## 定义网格

\`\`\`css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto;
  gap: 20px;
}
\`\`\`

## 网格项目定位

使用 \`grid-column\` 和 \`grid-row\` 属性来控制项目在网格中的位置。

| 属性 | 说明 |
|------|------|
| grid-column-start | 列起始位置 |
| grid-column-end | 列结束位置 |
| grid-row-start | 行起始位置 |
| grid-row-end | 行结束位置 |

## 响应式网格

结合媒体查询，可以轻松创建响应式网格布局。
    `
  },
  {
    id: 4,
    title: 'UI 设计中的色彩心理学',
    category: 'design',
    categoryName: '设计相关',
    date: '2024-05-03',
    readTime: '6 分钟',
    excerpt: '了解色彩在用户界面设计中的心理影响，打造更具吸引力的产品体验。',
    tags: ['设计', 'UI', '色彩'],
    content: `
## 色彩与情绪

不同的颜色会唤起不同的情绪反应，在设计中合理运用可以引导用户行为。

### 常见色彩含义

- **红色**：激情、能量、警示
- **蓝色**：信任、专业、冷静
- **绿色**：自然、成长、成功
- **黄色**：乐观、创意、注意

## 品牌色彩选择

品牌色彩应该反映品牌的价值观和个性，同时考虑目标受众的文化背景。

> 好的色彩设计能够在用户看到的第一秒就传达出产品的气质。
    `
  },
  {
    id: 5,
    title: '程序员的远程工作心得',
    category: 'life',
    categoryName: '生活随笔',
    date: '2024-04-28',
    readTime: '7 分钟',
    excerpt: '分享两年远程工作的经验总结，包括时间管理、沟通技巧和工作生活平衡。',
    tags: ['远程工作', '生活', '经验'],
    content: `
## 建立固定的工作空间

在家工作最重要的是有一个专门的工作区域，这有助于进入工作状态。

1. 选择安静的房间
2. 配备舒适的桌椅
3. 保持桌面整洁

## 保持规律的作息

固定的上下班时间有助于维持工作和生活的边界，避免过度工作。

\`\`\`
建议时间表：
- 09:00 - 开始工作
- 12:00 - 午餐休息
- 14:00 - 下午工作
- 18:00 - 结束工作
\`\`\`

## 有效沟通

远程团队需要更主动的沟通，建议使用合适的工具并建立固定的同步机制。
    `
  }
]

export const comments = [
  {
    id: 1,
    postId: 1,
    author: '李四',
    content: '写得太好了！组合式 API 确实让代码组织更清晰了。',
    date: '2024-05-11 10:30',
    avatar: '👨'
  },
  {
    id: 2,
    postId: 1,
    author: '王五',
    content: '请问一下，ref 和 reactive 在使用场景上有什么区别？',
    date: '2024-05-11 14:20',
    avatar: '👩'
  },
  {
    id: 3,
    postId: 1,
    author: '赵六',
    content: '学习了，感谢分享！',
    date: '2024-05-12 09:15',
    avatar: '🧑'
  }
]
