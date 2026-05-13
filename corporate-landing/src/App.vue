<template>
  <div class="app">
    <Navbar />
    <main>
      <Hero />
      <Products />
      <Cases />
      <Team />
      <Contact />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import Navbar from './components/Navbar.vue'
import Hero from './components/Hero.vue'
import Products from './components/Products.vue'
import Cases from './components/Cases.vue'
import Team from './components/Team.vue'
import Contact from './components/Contact.vue'
import Footer from './components/Footer.vue'

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }
  )

  const animatedElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right')
  animatedElements.forEach((el) => {
    observer.observe(el)
  })
})
</script>

<style scoped lang="scss">
.app {
  min-height: 100vh;
}
</style>
