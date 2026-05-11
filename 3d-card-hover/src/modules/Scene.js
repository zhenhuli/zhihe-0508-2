import * as THREE from 'three';

export class Scene {
  constructor(container) {
    this.container = container;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.animationId = null;
    this.updateCallbacks = [];
    
    this.init();
  }

  init() {
    this.createScene();
    this.createCamera();
    this.createRenderer();
    this.setupEventListeners();
  }

  createScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0a0f);
  }

  createCamera() {
    const aspect = this.getAspectRatio();
    this.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
    this.camera.position.z = 8;
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(this.getWidth(), this.getHeight());
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);
  }

  getWidth() {
    return this.container.clientWidth;
  }

  getHeight() {
    return this.container.clientHeight;
  }

  getAspectRatio() {
    return this.getWidth() / this.getHeight();
  }

  setupEventListeners() {
    window.addEventListener('resize', () => this.onResize());
  }

  onResize() {
    const width = this.getWidth();
    const height = this.getHeight();
    
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  add(object) {
    this.scene.add(object);
  }

  remove(object) {
    this.scene.remove(object);
  }

  addUpdateCallback(callback) {
    this.updateCallbacks.push(callback);
  }

  removeUpdateCallback(callback) {
    const index = this.updateCallbacks.indexOf(callback);
    if (index > -1) {
      this.updateCallbacks.splice(index, 1);
    }
  }

  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());
    
    this.updateCallbacks.forEach(callback => callback());
    
    this.renderer.render(this.scene, this.camera);
  }

  start() {
    if (!this.animationId) {
      this.animate();
    }
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  getScene() {
    return this.scene;
  }

  getCamera() {
    return this.camera;
  }

  getRenderer() {
    return this.renderer;
  }

  getCanvas() {
    return this.renderer.domElement;
  }

  dispose() {
    this.stop();
    window.removeEventListener('resize', () => this.onResize());
    
    if (this.renderer) {
      this.renderer.dispose();
      if (this.renderer.domElement.parentNode) {
        this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      }
    }
    
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.updateCallbacks = [];
  }
}
