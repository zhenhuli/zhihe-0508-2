import * as THREE from 'three'

export class CylinderGallery {
  constructor(container) {
    this.container = container
    this.images = []
    this.imageMeshes = []
    this.selectedIndex = -1
    
    this.init()
  }

  init() {
    this.scene = new THREE.Scene()
    
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    this.camera.position.z = 5

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.container.appendChild(this.renderer.domElement)

    this.addLights()
    this.createCylinder()
    
    window.addEventListener('resize', () => this.onResize())
    
    this.animate()
  }

  addLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    this.scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(5, 5, 5)
    this.scene.add(directionalLight)

    const pointLight = new THREE.PointLight(0x4a90d9, 0.5)
    pointLight.position.set(-5, 3, 3)
    this.scene.add(pointLight)
  }

  createCylinder() {
    this.cylinderGroup = new THREE.Group()
    
    const cylinderGeometry = new THREE.CylinderGeometry(2, 2, 4, 64, 1, true)
    const cylinderMaterial = new THREE.MeshPhongMaterial({
      color: 0x222244,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
    })
    this.cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial)
    this.cylinderGroup.add(this.cylinder)

    const ringGeometry = new THREE.TorusGeometry(2.05, 0.02, 16, 100)
    const ringMaterial = new THREE.MeshPhongMaterial({ color: 0x4a90d9 })
    
    const topRing = new THREE.Mesh(ringGeometry, ringMaterial)
    topRing.rotation.x = Math.PI / 2
    topRing.position.y = 2
    this.cylinderGroup.add(topRing)

    const bottomRing = new THREE.Mesh(ringGeometry, ringMaterial)
    bottomRing.rotation.x = Math.PI / 2
    bottomRing.position.y = -2
    this.cylinderGroup.add(bottomRing)

    this.scene.add(this.cylinderGroup)
  }

  addImage(imageUrl) {
    const index = this.images.length
    this.images.push(imageUrl)

    const textureLoader = new THREE.TextureLoader()
    textureLoader.load(imageUrl, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace
      
      const aspect = texture.image.width / texture.image.height
      const height = 1.5
      const width = height * aspect
      
      const geometry = new THREE.PlaneGeometry(width, height)
      const material = new THREE.MeshPhongMaterial({
        map: texture,
        side: THREE.DoubleSide,
      })

      const mesh = new THREE.Mesh(geometry, material)
      
      const angle = (index / Math.max(this.images.length, 1)) * Math.PI * 2
      const radius = 2.05
      
      mesh.position.x = Math.cos(angle) * radius
      mesh.position.z = Math.sin(angle) * radius
      mesh.rotation.y = angle + Math.PI / 2

      mesh.userData = { index, imageUrl }
      
      this.imageMeshes.push(mesh)
      this.cylinderGroup.add(mesh)

      this.repositionImages()
    })
  }

  repositionImages() {
    const count = this.imageMeshes.length
    if (count === 0) return

    this.imageMeshes.forEach((mesh, i) => {
      const angle = (i / count) * Math.PI * 2
      const radius = 2.05
      
      mesh.position.x = Math.cos(angle) * radius
      mesh.position.z = Math.sin(angle) * radius
      mesh.rotation.y = angle + Math.PI / 2
      mesh.userData.index = i
    })
  }

  removeSelectedImage() {
    if (this.selectedIndex < 0 || this.selectedIndex >= this.imageMeshes.length) {
      return null
    }

    const mesh = this.imageMeshes[this.selectedIndex]
    this.cylinderGroup.remove(mesh)
    this.images.splice(this.selectedIndex, 1)
    this.imageMeshes.splice(this.selectedIndex, 1)
    
    this.selectedIndex = -1
    this.repositionImages()
    
    return true
  }

  selectImage(index) {
    this.imageMeshes.forEach((mesh, i) => {
      mesh.material.emissive = new THREE.Color(i === index ? 0x333333 : 0x000000)
    })
    this.selectedIndex = index
  }

  getSelectedImageUrl() {
    if (this.selectedIndex >= 0 && this.selectedIndex < this.images.length) {
      return this.images[this.selectedIndex]
    }
    return null
  }

  rotate(deltaX, deltaY) {
    this.cylinderGroup.rotation.y += deltaX * 0.01
    this.cylinderGroup.rotation.x += deltaY * 0.01
    this.cylinderGroup.rotation.x = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, this.cylinderGroup.rotation.x))
  }

  getRaycasterIntersects(mouse) {
    const raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(mouse, this.camera)
    return raycaster.intersectObjects(this.imageMeshes)
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  animate() {
    requestAnimationFrame(() => this.animate())
    this.renderer.render(this.scene, this.camera)
  }

  dispose() {
    this.renderer.dispose()
    this.container.removeChild(this.renderer.domElement)
  }
}
