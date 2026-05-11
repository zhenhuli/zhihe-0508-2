import * as THREE from 'three';

export class MouseInteraction {
  constructor(sceneManager, cardManager) {
    this.sceneManager = sceneManager;
    this.cardManager = cardManager;
    
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    
    this.hoveredCard = null;
    this.onCardHover = null;
    this.onCardClick = null;
    
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetMouseX = 0;
    this.targetMouseY = 0;
    
    this.init();
  }

  init() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    const canvas = this.sceneManager.getCanvas();
    
    canvas.addEventListener('mousemove', (event) => this.onMouseMove(event));
    canvas.addEventListener('mouseleave', (event) => this.onMouseLeave(event));
    canvas.addEventListener('click', (event) => this.onMouseClick(event));
    
    canvas.addEventListener('touchstart', (event) => this.onTouchStart(event), { passive: true });
    canvas.addEventListener('touchmove', (event) => this.onTouchMove(event), { passive: true });
    canvas.addEventListener('touchend', (event) => this.onTouchEnd(event), { passive: true });
  }

  onMouseMove(event) {
    this.updateMousePosition(event);
    this.checkIntersection();
    this.updateGlobalTilt();
  }

  onMouseLeave(event) {
    this.clearHover();
    this.resetGlobalTilt();
  }

  onMouseClick(event) {
    this.updateMousePosition(event);
    this.checkIntersection();
    
    if (this.hoveredCard && this.onCardClick) {
      this.onCardClick(this.hoveredCard);
    }
  }

  onTouchStart(event) {
    if (event.touches.length > 0) {
      const touch = event.touches[0];
      this.updateMousePosition({
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      this.checkIntersection();
    }
  }

  onTouchMove(event) {
    if (event.touches.length > 0) {
      const touch = event.touches[0];
      this.updateMousePosition({
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      this.checkIntersection();
      this.updateGlobalTilt();
    }
  }

  onTouchEnd(event) {
    if (this.hoveredCard && this.onCardClick) {
      this.onCardClick(this.hoveredCard);
    }
    this.clearHover();
    this.resetGlobalTilt();
  }

  updateMousePosition(event) {
    const canvas = this.sceneManager.getCanvas();
    const rect = canvas.getBoundingClientRect();
    
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    this.targetMouseX = this.mouse.x;
    this.targetMouseY = this.mouse.y;
  }

  checkIntersection() {
    this.raycaster.setFromCamera(
      this.mouse,
      this.sceneManager.getCamera()
    );
    
    const cardMeshes = this.cardManager.getCards().map(card => card.getMesh());
    const intersects = this.raycaster.intersectObjects(cardMeshes);
    
    if (intersects.length > 0) {
      const intersectedMesh = intersects[0].object;
      const card = this.cardManager.getCards().find(
        c => c.getMesh() === intersectedMesh
      );
      
      if (card && card !== this.hoveredCard) {
        this.clearHover();
        this.setHovered(card, intersects[0]);
      }
    } else {
      this.clearHover();
    }
  }

  setHovered(card, intersection) {
    this.hoveredCard = card;
    card.setHovered(true);
    
    if (intersection) {
      const uv = intersection.uv;
      if (uv) {
        const tiltX = (uv.y - 0.5) * 0.3;
        const tiltY = (uv.x - 0.5) * 0.3;
        card.setRotation(tiltX, tiltY);
      }
    }
    
    if (this.onCardHover) {
      this.onCardHover(card, true);
    }
  }

  clearHover() {
    if (this.hoveredCard) {
      this.hoveredCard.setHovered(false);
      this.hoveredCard.setRotation(0, 0);
      
      if (this.onCardHover) {
        this.onCardHover(this.hoveredCard, false);
      }
      
      this.hoveredCard = null;
    }
  }

  updateGlobalTilt() {
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.1;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.1;
    
    const camera = this.sceneManager.getCamera();
    camera.position.x = this.mouseX * 0.5;
    camera.position.y = -this.mouseY * 0.3;
    camera.lookAt(0, 0, 0);
  }

  resetGlobalTilt() {
    this.targetMouseX = 0;
    this.targetMouseY = 0;
    
    const camera = this.sceneManager.getCamera();
    camera.position.x = 0;
    camera.position.y = 0;
    camera.lookAt(0, 0, 0);
  }

  update() {
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;
  }

  setOnCardHover(callback) {
    this.onCardHover = callback;
  }

  setOnCardClick(callback) {
    this.onCardClick = callback;
  }

  getHoveredCard() {
    return this.hoveredCard;
  }

  dispose() {
    const canvas = this.sceneManager.getCanvas();
    
    canvas.removeEventListener('mousemove', (event) => this.onMouseMove(event));
    canvas.removeEventListener('mouseleave', (event) => this.onMouseLeave(event));
    canvas.removeEventListener('click', (event) => this.onMouseClick(event));
    
    canvas.removeEventListener('touchstart', (event) => this.onTouchStart(event));
    canvas.removeEventListener('touchmove', (event) => this.onTouchMove(event));
    canvas.removeEventListener('touchend', (event) => this.onTouchEnd(event));
    
    this.hoveredCard = null;
    this.onCardHover = null;
    this.onCardClick = null;
  }
}
