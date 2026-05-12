import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

let scene, camera, renderer, controls
let mainLight, ambientLight, pointLight1, pointLight2
let objects = []
let currentMaterialType = 'standard'

function init() {
  const container = document.getElementById('canvas-container')
  
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x1a1a2e)
  
  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.set(0, 5, 10)
  
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFShadowMap
  container.appendChild(renderer.domElement)
  
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.minDistance = 5
  controls.maxDistance = 30
  controls.target.set(0, 1, 0)
  
  createLights()
  createObjects()
  createFloor()
  setupControls()
  
  window.addEventListener('resize', onWindowResize)
  animate()
}

function createLights() {
  ambientLight = new THREE.AmbientLight(0x404040, 0.3)
  scene.add(ambientLight)
  
  mainLight = new THREE.DirectionalLight(0xffffff, 1)
  mainLight.position.set(5, 10, 5)
  mainLight.castShadow = true
  mainLight.shadow.mapSize.width = 2048
  mainLight.shadow.mapSize.height = 2048
  mainLight.shadow.camera.near = 0.5
  mainLight.shadow.camera.far = 50
  mainLight.shadow.camera.left = -10
  mainLight.shadow.camera.right = 10
  mainLight.shadow.camera.top = 10
  mainLight.shadow.camera.bottom = -10
  scene.add(mainLight)
  
  pointLight1 = new THREE.PointLight(0xff6b6b, 0.8, 20)
  pointLight1.position.set(-4, 3, 2)
  pointLight1.castShadow = true
  scene.add(pointLight1)
  
  const lightHelper1 = new THREE.SphereGeometry(0.1)
  const lightMaterial1 = new THREE.MeshBasicMaterial({ color: 0xff6b6b })
  const lightMesh1 = new THREE.Mesh(lightHelper1, lightMaterial1)
  lightMesh1.position.copy(pointLight1.position)
  scene.add(lightMesh1)
  
  pointLight2 = new THREE.PointLight(0x4ecdc4, 0.8, 20)
  pointLight2.position.set(4, 3, -2)
  pointLight2.castShadow = true
  scene.add(pointLight2)
  
  const lightHelper2 = new THREE.SphereGeometry(0.1)
  const lightMaterial2 = new THREE.MeshBasicMaterial({ color: 0x4ecdc4 })
  const lightMesh2 = new THREE.Mesh(lightHelper2, lightMaterial2)
  lightMesh2.position.copy(pointLight2.position)
  scene.add(lightMesh2)
}

function createMaterial(type) {
  const materials = {
    standard: new THREE.MeshStandardMaterial({
      color: 0x64b5f6,
      metalness: 0.3,
      roughness: 0.5
    }),
    phong: new THREE.MeshPhongMaterial({
      color: 0xff8a65,
      shininess: 100,
      specular: 0x444444
    }),
    metallic: new THREE.MeshStandardMaterial({
      color: 0xc0c0c0,
      metalness: 1,
      roughness: 0.1
    }),
    glass: new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0,
      roughness: 0,
      transmission: 0.9,
      transparent: true,
      opacity: 0.8,
      ior: 1.5,
      thickness: 0.5
    }),
    cotton: new THREE.MeshPhysicalMaterial({
      color: 0xe8dcc4,
      metalness: 0,
      roughness: 1,
      clearcoat: 0,
      clearcoatRoughness: 0,
      sheen: 0.1,
      sheenColor: new THREE.Color(0xffffff)
    }),
    fur: new THREE.MeshPhysicalMaterial({
      color: 0x8b4513,
      metalness: 0,
      roughness: 0.95,
      clearcoat: 0.1,
      clearcoatRoughness: 1,
      sheen: 0.3,
      sheenColor: new THREE.Color(0xd4a574)
    }),
    rubber: new THREE.MeshPhysicalMaterial({
      color: 0x2c2c2c,
      metalness: 0,
      roughness: 0.9,
      clearcoat: 0.2,
      clearcoatRoughness: 0.8
    }),
    wood: new THREE.MeshPhysicalMaterial({
      color: 0x8b5a2b,
      metalness: 0,
      roughness: 0.7,
      clearcoat: 0.3,
      clearcoatRoughness: 0.5,
      anisotropy: 0.5,
      anisotropyRotation: 0
    }),
    marble: new THREE.MeshPhysicalMaterial({
      color: 0xf5f5f5,
      metalness: 0,
      roughness: 0.2,
      clearcoat: 0.8,
      clearcoatRoughness: 0.1
    }),
    silk: new THREE.MeshPhysicalMaterial({
      color: 0xffb6c1,
      metalness: 0,
      roughness: 0.3,
      sheen: 0.8,
      sheenColor: new THREE.Color(0xffffff),
      anisotropy: 0.7,
      anisotropyRotation: 0
    }),
    leather: new THREE.MeshPhysicalMaterial({
      color: 0x654321,
      metalness: 0.1,
      roughness: 0.6,
      clearcoat: 0.4,
      clearcoatRoughness: 0.6
    }),
    ceramic: new THREE.MeshPhysicalMaterial({
      color: 0xadd8e6,
      metalness: 0,
      roughness: 0.1,
      clearcoat: 1,
      clearcoatRoughness: 0.05
    }),
    wireframe: new THREE.MeshBasicMaterial({
      color: 0x00ff88,
      wireframe: true
    })
  }
  return materials[type] || materials.standard
}

function createObjects() {
  const material = createMaterial(currentMaterialType)
  
  const sphereGeo = new THREE.SphereGeometry(1.2, 64, 64)
  const sphere = new THREE.Mesh(sphereGeo, material.clone())
  sphere.position.set(-2, 1.2, 0)
  sphere.castShadow = true
  sphere.receiveShadow = true
  scene.add(sphere)
  objects.push(sphere)
  
  const boxGeo = new THREE.BoxGeometry(1.5, 1.5, 1.5)
  const box = new THREE.Mesh(boxGeo, material.clone())
  box.position.set(2, 0.75, 0)
  box.rotation.y = Math.PI / 4
  box.castShadow = true
  box.receiveShadow = true
  scene.add(box)
  objects.push(box)
  
  const coneGeo = new THREE.ConeGeometry(0.8, 2, 32)
  const cone = new THREE.Mesh(coneGeo, material.clone())
  cone.position.set(0, 1, -3)
  cone.castShadow = true
  cone.receiveShadow = true
  scene.add(cone)
  objects.push(cone)
  
  const torusGeo = new THREE.TorusGeometry(0.7, 0.2, 16, 100)
  const torus = new THREE.Mesh(torusGeo, material.clone())
  torus.position.set(0, 0.8, 2.5)
  torus.rotation.x = Math.PI / 2
  torus.castShadow = true
  torus.receiveShadow = true
  scene.add(torus)
  objects.push(torus)
  
  const cylinderGeo = new THREE.CylinderGeometry(0.5, 0.5, 2, 32)
  const cylinder = new THREE.Mesh(cylinderGeo, material.clone())
  cylinder.position.set(-3.5, 1, 2.5)
  cylinder.castShadow = true
  cylinder.receiveShadow = true
  scene.add(cylinder)
  objects.push(cylinder)
}

function createFloor() {
  const floorGeo = new THREE.PlaneGeometry(30, 30)
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0x2d2d44,
    metalness: 0.1,
    roughness: 0.8
  })
  const floor = new THREE.Mesh(floorGeo, floorMat)
  floor.rotation.x = -Math.PI / 2
  floor.receiveShadow = true
  scene.add(floor)
  
  const gridHelper = new THREE.GridHelper(30, 30, 0x444466, 0x333355)
  scene.add(gridHelper)
}

function setupControls() {
  const lightColorInput = document.getElementById('light-color')
  const lightIntensityInput = document.getElementById('light-intensity')
  const intensityValue = document.getElementById('intensity-value')
  const shadowIntensityInput = document.getElementById('shadow-intensity')
  const shadowValue = document.getElementById('shadow-value')
  const materialBtns = document.querySelectorAll('.material-btn')
  
  lightColorInput.addEventListener('input', (e) => {
    mainLight.color.set(e.target.value)
  })
  
  lightIntensityInput.addEventListener('input', (e) => {
    const value = parseFloat(e.target.value)
    mainLight.intensity = value
    intensityValue.textContent = value.toFixed(1)
  })
  
  shadowIntensityInput.addEventListener('input', (e) => {
    const value = parseFloat(e.target.value)
    mainLight.shadow.intensity = value
    shadowValue.textContent = value.toFixed(2)
  })
  
  materialBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      materialBtns.forEach(b => b.classList.remove('active'))
      btn.classList.add('active')
      currentMaterialType = btn.dataset.material
      updateMaterials()
    })
  })
  
  materialBtns[0].classList.add('active')
}

function updateMaterials() {
  const newMaterial = createMaterial(currentMaterialType)
  objects.forEach(obj => {
    obj.material.dispose()
    obj.material = newMaterial.clone()
  })
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

function animate() {
  requestAnimationFrame(animate)
  
  const time = Date.now() * 0.001
  objects.forEach((obj, index) => {
    obj.rotation.y = time * 0.3 + index * 0.5
  })
  
  controls.update()
  renderer.render(scene, camera)
}

init()
