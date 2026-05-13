import { posts, comments } from './data.js'
import { initTheme, toggleTheme } from './theme.js'
import { marked } from 'marked'

function getPostId() {
  const params = new URLSearchParams(window.location.search)
  return parseInt(params.get('id')) || 1
}

function renderPost(post) {
  document.getElementById('postTitle').textContent = post.title
  document.getElementById('postContent').innerHTML = marked(post.content)
  
  const metaCategory = document.querySelector('.post-category')
  const metaDate = document.querySelector('.post-date')
  const metaReadTime = document.querySelector('.post-read-time')
  
  metaCategory.textContent = post.categoryName
  metaDate.textContent = post.date
  metaReadTime.textContent = post.readTime
}

function renderComments(postId) {
  const postComments = comments.filter(c => c.postId === postId)
  const commentsContainer = document.getElementById('commentsList')
  
  commentsContainer.innerHTML = postComments.map(comment => `
    <div class="comment">
      <div class="comment-avatar">${comment.avatar}</div>
      <div class="comment-content">
        <div class="comment-header">
          <span class="comment-author">${comment.author}</span>
          <span class="comment-date">${comment.date}</span>
        </div>
        <p class="comment-text">${comment.content}</p>
      </div>
    </div>
  `).join('')
}

function addComment(postId) {
  const nameInput = document.getElementById('commentName')
  const contentInput = document.getElementById('commentContent')
  
  const name = nameInput.value.trim()
  const content = contentInput.value.trim()
  
  if (!name || !content) {
    alert('请填写昵称和评论内容')
    return
  }
  
  const newComment = {
    id: comments.length + 1,
    postId,
    author: name,
    content,
    date: new Date().toLocaleString('zh-CN'),
    avatar: '😊'
  }
  
  comments.push(newComment)
  renderComments(postId)
  
  nameInput.value = ''
  contentInput.value = ''
}

function init() {
  initTheme()

  document.getElementById('themeToggle').addEventListener('click', toggleTheme)

  const postId = getPostId()
  const post = posts.find(p => p.id === postId) || posts[0]
  
  renderPost(post)
  renderComments(postId)

  document.getElementById('submitComment').addEventListener('click', () => {
    addComment(postId)
  })
}

document.addEventListener('DOMContentLoaded', init)
