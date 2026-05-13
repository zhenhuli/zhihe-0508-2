<template>
  <nav class="navbar" :class="{ 'navbar-scrolled': isScrolled }">
    <div class="container navbar-container">
      <div class="navbar-logo">
        <span class="logo-icon">智</span>
        <span class="logo-text">智和科技</span>
      </div>
      
      <ul class="navbar-menu" :class="{ 'active': isMobileMenuOpen }">
        <li v-for="item in menuItems" :key="item.id">
          <a :href="item.href" class="navbar-link" @click="closeMobileMenu">
            {{ item.label }}
          </a>
        </li>
      </ul>

      <button class="navbar-cta btn btn-primary d-none d-md-flex">
        免费咨询
      </button>

      <button class="mobile-menu-btn" @click="toggleMobileMenu">
        <span v-if="!isMobileMenuOpen">☰</span>
        <span v-else>✕</span>
      </button>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)

const menuItems = [
  { id: 1, label: '首页', href: '#hero' },
  { id: 2, label: '产品', href: '#products' },
  { id: 3, label: '案例', href: '#cases' },
  { id: 4, label: '团队', href: '#team' },
  { id: 5, label: '联系我们', href: '#contact' }
]

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped lang="scss">
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  transition: all $transition-normal;
  padding: $spacing-lg 0;

  &-scrolled {
    padding: $spacing-md 0;
    box-shadow: $shadow-md;
  }

  &-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &-logo {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    font-weight: 700;
    font-size: $font-size-xl;

    .logo-icon {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, $primary-color, $primary-dark);
      border-radius: $border-radius-md;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: $font-size-lg;
    }

    .logo-text {
      color: $text-dark;
    }
  }

  &-menu {
    display: flex;
    align-items: center;
    gap: $spacing-xl;

    &.active {
      display: flex;
      position: fixed;
      top: 70px;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: white;
      flex-direction: column;
      padding: $spacing-2xl;
      gap: $spacing-lg;
    }
  }

  &-link {
    color: $text-light;
    font-weight: 500;
    position: relative;
    padding: $spacing-sm 0;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 2px;
      background-color: $primary-color;
      transition: width $transition-normal;
    }

    &:hover {
      color: $primary-color;

      &::after {
        width: 100%;
      }
    }
  }

  &-cta {
    margin-left: $spacing-lg;
  }
}

.mobile-menu-btn {
  display: none;
  background: none;
  font-size: $font-size-2xl;
  color: $text-dark;
  padding: $spacing-sm;
}

@media (max-width: $breakpoint-md) {
  .navbar-menu {
    display: none;
  }

  .mobile-menu-btn {
    display: block;
  }

  .navbar-cta {
    display: none;
  }

  .d-md-flex {
    display: none !important;
  }
}
</style>
