import './style.css'
import * as THREE from 'three'

class GerstnerWave {
  constructor(direction, steepness, wavelength, speed) {
    this.direction = direction.normalize()
    this.steepness = steepness
    this.wavelength = wavelength
    this.speed = speed
    this.frequency = 2 * Math.PI / wavelength
    this.phase = speed * this.frequency
  }
}

class WaveScene {
  constructor() {
    this.container = document.getElementById('canvas-container')
    this.params = {
      waveHeight: 1,
      waveDensity: 1,
      waveSpeed: 1,
      isDark: false
    }
    
    this.init()
    this.setupControls()
    this.setupTheme()
    this.animate()
    window.addEventListener('resize', () => this.onResize())
  }
  
  init() {
    this.scene = new THREE.Scene()
    
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    this.camera.position.set(0, 3, 8)
    this.camera.lookAt(0, 0, 0)
    
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    })
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.2
    this.container.appendChild(this.renderer.domElement)
    
    this.initWaves()
    this.createWave()
    this.setupLighting()
  }
  
  initWaves() {
    this.waves = [
      new GerstnerWave(new THREE.Vector2(1, 0.3), 0.15, 8, 0.8),
      new GerstnerWave(new THREE.Vector2(1, 1), 0.1, 5, 1.0),
      new GerstnerWave(new THREE.Vector2(0.5, 1.5), 0.08, 3, 1.2),
      new GerstnerWave(new THREE.Vector2(-0.7, 0.5), 0.06, 2, 0.6),
      new GerstnerWave(new THREE.Vector2(0.3, -0.8), 0.04, 4, 0.9),
      new GerstnerWave(new THREE.Vector2(-1, -0.2), 0.03, 6, 0.5)
    ]
  }
  
  createWave() {
    const geometry = new THREE.PlaneGeometry(30, 30, 256, 256)
    geometry.rotateX(-Math.PI / 2)
    
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x1e88e5,
      metalness: 0.1,
      roughness: 0.1,
      transmission: 0.3,
      transmissionSampler: false,
      thickness: 1.5,
      ior: 1.4,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      side: THREE.DoubleSide
    })
    
    this.wave = new THREE.Mesh(geometry, material)
    this.scene.add(this.wave)
    
    this.originalPositions = geometry.attributes.position.array.slice()
  }
  
  setupLighting() {
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
    this.scene.add(this.ambientLight)
    
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1.5)
    this.directionalLight.position.set(10, 15, 10)
    this.directionalLight.castShadow = true
    this.scene.add(this.directionalLight)
    
    this.fillLight = new THREE.DirectionalLight(0x64b5f6, 0.5)
    this.fillLight.position.set(-5, 5, -5)
    this.scene.add(this.fillLight)
    
    this.pointLight = new THREE.PointLight(0x42a5f5, 1, 30)
    this.pointLight.position.set(0, 8, 0)
    this.scene.add(this.pointLight)
  }
  
  gerstnerWave(wave, x, z, time) {
    const wavePos = new THREE.Vector2(x, z)
    const dot = wave.direction.dot(wavePos)
    const calc = wave.frequency * dot + wave.phase * time
    
    const result = new THREE.Vector3()
    result.x = wave.direction.x * wave.steepness * Math.sin(calc)
    result.z = wave.direction.y * wave.steepness * Math.sin(calc)
    result.y = Math.cos(calc)
    
    return result
  }
  
  updateWave(time) {
    const positions = this.wave.geometry.attributes.position.array
    const normals = this.wave.geometry.attributes.normal.array
    
    for (let i = 0; i < positions.length / 3; i++) {
      const x = this.originalPositions[i * 3]
      const z = this.originalPositions[i * 3 + 2]
      
      let displacement = new THREE.Vector3(x, 0, z)
      
      for (const wave of this.waves) {
        const waveResult = this.gerstnerWave(wave, x, z, time)
        displacement.x += waveResult.x * this.params.waveHeight * this.params.waveDensity
        displacement.z += waveResult.z * this.params.waveHeight * this.params.waveDensity
        displacement.y += waveResult.y * this.params.waveHeight
      }
      
      positions[i * 3] = displacement.x
      positions[i * 3 + 1] = displacement.y
      positions[i * 3 + 2] = displacement.z
    }
    
    this.wave.geometry.attributes.position.needsUpdate = true
    this.wave.geometry.computeVertexNormals()
  }
  
  setTheme(isDark) {
    this.params.isDark = isDark
    
    if (isDark) {
      this.wave.material.color.setHex(0x0d47a1)
      this.wave.material.ior = 1.5
      this.pointLight.color.setHex(0x1565c0)
      this.fillLight.color.setHex(0x0d47a1)
      this.scene.background = new THREE.Color(0x0a1929)
      this.scene.fog = new THREE.FogExp2(0x0a1929, 0.02)
      this.ambientLight.intensity = 0.2
      this.directionalLight.intensity = 0.8
    } else {
      this.wave.material.color.setHex(0x1e88e5)
      this.wave.material.ior = 1.4
      this.pointLight.color.setHex(0x42a5f5)
      this.fillLight.color.setHex(0x64b5f6)
      this.scene.background = new THREE.Color(0xe3f2fd)
      this.scene.fog = new THREE.FogExp2(0xe3f2fd, 0.015)
      this.ambientLight.intensity = 0.4
      this.directionalLight.intensity = 1.5
    }
  }
  
  setupControls() {
    const heightSlider = document.getElementById('wave-height')
    const densitySlider = document.getElementById('wave-density')
    const speedSlider = document.getElementById('wave-speed')
    
    const heightValue = document.getElementById('height-value')
    const densityValue = document.getElementById('density-value')
    const speedValue = document.getElementById('speed-value')
    
    heightSlider.addEventListener('input', (e) => {
      this.params.waveHeight = parseFloat(e.target.value)
      heightValue.textContent = e.target.value
    })
    
    densitySlider.addEventListener('input', (e) => {
      this.params.waveDensity = parseFloat(e.target.value)
      densityValue.textContent = e.target.value
    })
    
    speedSlider.addEventListener('input', (e) => {
      this.params.waveSpeed = parseFloat(e.target.value)
      speedValue.textContent = e.target.value
      this.updateWaveSpeed(e.target.value)
    })
  }
  
  updateWaveSpeed(speed) {
    this.waves.forEach((wave, index) => {
      const baseSpeeds = [0.8, 1.0, 1.2, 0.6, 0.9, 0.5]
      wave.phase = baseSpeeds[index] * wave.frequency * speed
    })
  }
  
  setupTheme() {
    const themeToggle = document.getElementById('theme-toggle')
    const themeIcon = document.getElementById('theme-icon')
    const themeText = document.getElementById('theme-text')
    const html = document.documentElement
    
    const isDark = localStorage.getItem('theme') === 'dark' || 
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
    
    if (isDark) {
      html.classList.add('dark')
      html.classList.remove('light')
      themeIcon.textContent = '☀️'
      themeText.textContent = '切换浅色主题'
      this.setTheme(true)
    }
    
    themeToggle.addEventListener('click', () => {
      const isDark = html.classList.toggle('dark')
      html.classList.toggle('light', !isDark)
      
      if (isDark) {
        themeIcon.textContent = '☀️'
        themeText.textContent = '切换浅色主题'
        localStorage.setItem('theme', 'dark')
      } else {
        themeIcon.textContent = '🌙'
        themeText.textContent = '切换深色主题'
        localStorage.setItem('theme', 'light')
      }
      
      this.setTheme(isDark)
    })
  }
  
  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }
  
  animate() {
    requestAnimationFrame(() => this.animate())
    
    const time = performance.now() * 0.001 * this.params.waveSpeed
    this.updateWave(time)
    
    this.wave.rotation.y = Math.sin(time * 0.1) * 0.1
    
    this.camera.position.x = Math.sin(time * 0.05) * 0.5
    this.camera.position.y = 3 + Math.sin(time * 0.03) * 0.3
    this.camera.lookAt(0, 0, 0)
    
    this.renderer.render(this.scene, this.camera)
  }
}

new WaveScene()
