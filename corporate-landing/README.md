# 智和科技企业官网

一个现代化的企业官网落地页，基于 Vue 3 + Vite + SCSS 构建。

## 功能特点

- 📱 **响应式设计** - 完美适配桌面、平板和手机设备
- ✨ **滚动动画** - 元素滚动进入视口时的渐入动画效果
- 🎨 **现代化UI** - 采用渐变、阴影等现代设计元素
- 🚀 **高性能** - 基于 Vite 构建，快速加载
- 💼 **完整内容** - 包含导航栏、产品展示、客户案例、团队介绍、联系表单等

## 项目结构

```
corporate-landing/
├── src/
│   ├── components/
│   │   ├── Navbar.vue      # 导航栏组件
│   │   ├── Hero.vue        # 首页横幅组件
│   │   ├── Products.vue    # 产品展示组件
│   │   ├── Cases.vue       # 客户案例组件
│   │   ├── Team.vue        # 团队介绍组件
│   │   ├── Contact.vue     # 联系表单组件
│   │   └── Footer.vue      # 页脚组件
│   ├── styles/
│   │   ├── variables.scss  # SCSS 变量
│   │   └── global.scss     # 全局样式
│   ├── composables/
│   │   └── useScrollAnimation.js  # 滚动动画hook
│   ├── App.vue
│   └── main.js
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## 技术栈

- **框架**: Vue 3 (Composition API)
- **构建工具**: Vite
- **样式**: SCSS
- **动画**: Intersection Observer API

## 浏览器支持

- Chrome (最新)
- Firefox (最新)
- Safari (最新)
- Edge (最新)
