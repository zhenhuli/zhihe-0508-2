import { ref, onMounted, onUnmounted } from 'vue'

export function useScrollAnimation() {
  const animatedElements = ref([])

  const observerCallback = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
      }
    })
  }

  const initObserver = () => {
    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    })

    animatedElements.value = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right')
    
    animatedElements.value.forEach((el) => {
      observer.observe(el)
    })

    return observer
  }

  onMounted(() => {
    const observer = initObserver()
    onUnmounted(() => {
      observer.disconnect()
    })
  })

  return {
    animatedElements
  }
}
