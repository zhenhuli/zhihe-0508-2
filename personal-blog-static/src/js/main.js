import { posts } from './data.js'
import { initTheme, toggleTheme } from './theme.js'

let currentCategory = 'all'
let currentTag = null
let currentSearch = ''
let currentSort = 'date-desc'

function getAllTags() {
  const tagSet = new Set()
  posts.forEach(post => {
    post.tags.forEach(tag => tagSet.add(tag))
  })
  return Array.from(tagSet)
}

function renderTagFilter() {
  const tags = getAllTags()
  const tagContainer = document.getElementById('tagFilter')
  
  tagContainer.innerHTML = `
    <span class="tag-filter-item ${currentTag === null ? 'active' : ''}" data-tag="">全部标签</span>
    ${tags.map(tag => `
      <span class="tag-filter-item ${currentTag === tag ? 'active' : ''}" data-tag="${tag}">${tag}</span>
    `).join('')}
  `

  document.querySelectorAll('.tag-filter-item').forEach(item => {
    item.addEventListener('click', () => {
      const tag = item.dataset.tag
      currentTag = tag === '' ? null : tag
      applyFilters()
    })
  })
}

function sortPosts(postsList, sortType) {
  const sorted = [...postsList]
  
  switch (sortType) {
    case 'date-asc':
      return sorted.sort((a, b) => new Date(a.date) - new Date(b.date))
    case 'date-desc':
      return sorted.sort((a, b) => new Date(b.date) - new Date(a.date))
    case 'read-asc':
      return sorted.sort((a, b) => parseInt(a.readTime) - parseInt(b.readTime))
    case 'read-desc':
      return sorted.sort((a, b) => parseInt(b.readTime) - parseInt(a.readTime))
    default:
      return sorted
  }
}

function searchPosts(postsList, searchTerm) {
  if (!searchTerm.trim()) return postsList
  
  const term = searchTerm.toLowerCase().trim()
  return postsList.filter(post => 
    post.title.toLowerCase().includes(term) ||
    post.excerpt.toLowerCase().includes(term) ||
    post.tags.some(tag => tag.toLowerCase().includes(term)) ||
    post.categoryName.toLowerCase().includes(term)
  )
}

function applyFilters() {
  let filteredPosts = posts

  if (currentCategory !== 'all') {
    filteredPosts = filteredPosts.filter(post => post.category === currentCategory)
  }

  if (currentTag) {
    filteredPosts = filteredPosts.filter(post => post.tags.includes(currentTag))
  }

  filteredPosts = searchPosts(filteredPosts, currentSearch)
  filteredPosts = sortPosts(filteredPosts, currentSort)

  document.querySelectorAll('.category-item').forEach(item => {
    item.classList.remove('active')
    if (item.dataset.category === currentCategory) {
      item.classList.add('active')
    }
  })

  document.getElementById('postCount').textContent = filteredPosts.length
  renderPosts(filteredPosts)
}

function renderRecentPosts(postsList) {
  const recentPostsContainer = document.getElementById('recentPosts')
  const recentPosts = postsList.slice(0, 3)
  
  recentPostsContainer.innerHTML = recentPosts.map(post => `
    <li class="recent-post">
      <a href="#" data-id="${post.id}">${post.title}</a>
    </li>
  `).join('')

  document.querySelectorAll('.recent-post a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault()
      const postId = link.dataset.id
      window.location.href = `post.html?id=${postId}`
    })
  })
}

function renderPosts(postsList) {
  const postsContainer = document.getElementById('postsList')
  
  if (postsList.length === 0) {
    postsContainer.innerHTML = `
      <div class="no-results">
        <p>😕 没有找到匹配的文章</p>
        <p>尝试更换筛选条件或搜索关键词</p>
      </div>
    `
    return
  }

  postsContainer.innerHTML = postsList.map(post => `
    <article class="post-card" data-id="${post.id}">
      <div class="post-card-header">
        <span class="post-card-category">${post.categoryName}</span>
        <span class="post-card-date">${post.date}</span>
      </div>
      <h2 class="post-card-title">${post.title}</h2>
      <p class="post-card-excerpt">${post.excerpt}</p>
      <div class="post-card-footer">
        <div class="post-card-tags">
          ${post.tags.map(tag => `<span class="post-card-tag">${tag}</span>`).join('')}
        </div>
        <div class="post-card-meta">
          <span>📖 ${post.readTime}</span>
        </div>
      </div>
    </article>
  `).join('')

  document.querySelectorAll('.post-card').forEach(card => {
    card.addEventListener('click', () => {
      const postId = card.dataset.id
      window.location.href = `post.html?id=${postId}`
    })
  })
}

function filterPosts(category) {
  currentCategory = category
  applyFilters()
}

function init() {
  initTheme()

  document.getElementById('themeToggle').addEventListener('click', toggleTheme)

  document.querySelectorAll('.category-item').forEach(item => {
    item.addEventListener('click', () => {
      filterPosts(item.dataset.category)
    })
  })

  document.getElementById('searchInput').addEventListener('input', (e) => {
    currentSearch = e.target.value
    applyFilters()
  })

  document.getElementById('sortSelect').addEventListener('change', (e) => {
    currentSort = e.target.value
    applyFilters()
  })

  renderTagFilter()
  renderRecentPosts(posts)
  applyFilters()
}

document.addEventListener('DOMContentLoaded', init)
