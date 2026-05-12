import * as THREE from 'three'

export class Interaction {
  constructor(gallery, elements) {
    this.gallery = gallery
    this.elements = elements
    this.isDragging = false
    this.previousMouse = { x: 0, y: 0 }
    this.mouse = new THREE.Vector2()

    this.init()
  }

  init() {
    const canvas = this.gallery.renderer.domElement

    canvas.addEventListener('mousedown', (e) => this.onMouseDown(e))
    canvas.addEventListener('mousemove', (e) => this.onMouseMove(e))
    canvas.addEventListener('mouseup', () => this.onMouseUp())
    canvas.addEventListener('mouseleave', () => this.onMouseUp())

    canvas.addEventListener('touchstart', (e) => this.onTouchStart(e), { passive: false })
    canvas.addEventListener('touchmove', (e) => this.onTouchMove(e), { passive: false })
    canvas.addEventListener('touchend', () => this.onTouchEnd())

    canvas.addEventListener('click', (e) => this.onClick(e))

    this.elements.addImageInput.addEventListener('change', (e) => this.onAddImage(e))
    this.elements.deleteButton.addEventListener('click', () => this.onDeleteImage())
    this.elements.closePreview.addEventListener('click', () => this.closePreview())
    this.elements.previewModal.addEventListener('click', (e) => {
      if (e.target === this.elements.previewModal) {
        this.closePreview()
      }
    })

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closePreview()
      }
    })
  }

  updateMousePosition(clientX, clientY) {
    const canvas = this.gallery.renderer.domElement
    const rect = canvas.getBoundingClientRect()
    
    this.mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1
    this.mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1
  }

  onMouseDown(e) {
    this.isDragging = true
    this.previousMouse = { x: e.clientX, y: e.clientY }
    this.updateMousePosition(e.clientX, e.clientY)
  }

  onMouseMove(e) {
    this.updateMousePosition(e.clientX, e.clientY)
    
    if (this.isDragging) {
      const deltaX = e.clientX - this.previousMouse.x
      const deltaY = e.clientY - this.previousMouse.y
      
      this.gallery.rotate(deltaX, deltaY)
      
      this.previousMouse = { x: e.clientX, y: e.clientY }
    }
  }

  onMouseUp() {
    this.isDragging = false
  }

  onTouchStart(e) {
    e.preventDefault()
    if (e.touches.length === 1) {
      const touch = e.touches[0]
      this.isDragging = true
      this.previousMouse = { x: touch.clientX, y: touch.clientY }
      this.updateMousePosition(touch.clientX, touch.clientY)
    }
  }

  onTouchMove(e) {
    e.preventDefault()
    if (this.isDragging && e.touches.length === 1) {
      const touch = e.touches[0]
      const deltaX = touch.clientX - this.previousMouse.x
      const deltaY = touch.clientY - this.previousMouse.y
      
      this.gallery.rotate(deltaX, deltaY)
      
      this.previousMouse = { x: touch.clientX, y: touch.clientY }
      this.updateMousePosition(touch.clientX, touch.clientY)
    }
  }

  onTouchEnd() {
    this.isDragging = false
  }

  onClick(e) {
    this.updateMousePosition(e.clientX, e.clientY)
    const intersects = this.gallery.getRaycasterIntersects(this.mouse)
    
    if (intersects.length > 0) {
      const index = intersects[0].object.userData.index
      this.gallery.selectImage(index)
      this.showPreview(this.gallery.getSelectedImageUrl())
    } else {
      this.gallery.selectImage(-1)
    }
  }

  onAddImage(e) {
    const files = e.target.files
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const url = URL.createObjectURL(file)
      this.gallery.addImage(url)
    }
    e.target.value = ''
  }

  onDeleteImage() {
    this.gallery.removeSelectedImage()
  }

  showPreview(imageUrl) {
    if (imageUrl) {
      this.elements.previewImage.src = imageUrl
      this.elements.previewModal.classList.remove('hidden')
    }
  }

  closePreview() {
    this.elements.previewModal.classList.add('hidden')
    this.elements.previewImage.src = ''
  }
}
