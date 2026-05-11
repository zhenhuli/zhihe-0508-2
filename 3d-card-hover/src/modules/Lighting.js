import * as THREE from 'three';

export class Lighting {
  constructor(sceneManager) {
    this.sceneManager = sceneManager;
    this.lights = [];
    
    this.init();
  }

  init() {
    this.createAmbientLight();
    this.createDirectionalLight();
    this.createPointLight();
    this.createSpotLight();
  }

  createAmbientLight() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.sceneManager.add(ambientLight);
    this.lights.push(ambientLight);
  }

  createDirectionalLight() {
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -10;
    directionalLight.shadow.camera.right = 10;
    directionalLight.shadow.camera.top = 10;
    directionalLight.shadow.camera.bottom = -10;
    
    this.sceneManager.add(directionalLight);
    this.lights.push(directionalLight);
  }

  createPointLight() {
    const pointLight = new THREE.PointLight(0xe94560, 1, 20);
    pointLight.position.set(-5, 3, 3);
    pointLight.castShadow = true;
    
    this.sceneManager.add(pointLight);
    this.lights.push(pointLight);
  }

  createSpotLight() {
    const spotLight = new THREE.SpotLight(0x0f3460, 0.6, 30, Math.PI / 6, 0.5);
    spotLight.position.set(5, 5, -5);
    spotLight.castShadow = true;
    
    this.sceneManager.add(spotLight);
    this.lights.push(spotLight);
  }

  getLights() {
    return this.lights;
  }

  setAmbientIntensity(intensity) {
    const ambientLight = this.lights.find(light => light instanceof THREE.AmbientLight);
    if (ambientLight) {
      ambientLight.intensity = intensity;
    }
  }

  setDirectionalIntensity(intensity) {
    const directionalLight = this.lights.find(light => light instanceof THREE.DirectionalLight);
    if (directionalLight) {
      directionalLight.intensity = intensity;
    }
  }

  dispose() {
    this.lights.forEach(light => {
      this.sceneManager.remove(light);
      if (light.dispose) {
        light.dispose();
      }
    });
    this.lights = [];
  }
}
