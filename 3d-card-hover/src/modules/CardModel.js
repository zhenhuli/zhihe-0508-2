import * as THREE from 'three';

export class CardModel {
  constructor(index, data, width = 2, height = 3, depth = 0.1) {
    this.index = index;
    this.data = data;
    this.width = width;
    this.height = height;
    this.depth = depth;
    
    this.mesh = null;
    this.group = null;
    
    this.targetRotation = { x: 0, y: 0 };
    this.currentRotation = { x: 0, y: 0 };
    this.targetPosition = { x: 0, y: 0, z: 0 };
    this.currentPosition = { x: 0, y: 0, z: 0 };
    this.hovered = false;
    this.hoverScale = 1;
    this.targetHoverScale = 1;
    
    this.create();
  }

  create() {
    this.group = new THREE.Group();
    
    const geometry = new THREE.BoxGeometry(this.width, this.height, this.depth);
    
    const frontMaterial = this.createFrontMaterial();
    const backMaterial = this.createBackMaterial();
    const sideMaterial = this.createSideMaterial();
    
    const materials = [
      sideMaterial,
      sideMaterial,
      sideMaterial,
      sideMaterial,
      frontMaterial,
      backMaterial
    ];
    
    this.mesh = new THREE.Mesh(geometry, materials);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    
    this.group.add(this.mesh);
    
    if (this.data && this.data.title) {
      this.addTextLabel();
    }
  }

  createFrontMaterial() {
    const color = this.data ? this.data.color : this.getRandomColor();
    
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 768;
    const ctx = canvas.getContext('2d');
    
    const gradient = ctx.createLinearGradient(0, 0, 512, 768);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, this.shadeColor(color, -30));
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 768);
    
    if (this.data) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.font = 'bold 48px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.data.title || '', 256, 300);
      
      if (this.data.description) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.font = '28px Arial, sans-serif';
        const words = this.data.description.split(' ');
        let line = '';
        let y = 400;
        for (let i = 0; i < words.length; i++) {
          const testLine = line + words[i] + ' ';
          const metrics = ctx.measureText(testLine);
          if (metrics.width > 400 && i > 0) {
            ctx.fillText(line, 256, y);
            line = words[i] + ' ';
            y += 40;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, 256, y);
      }
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    
    return new THREE.MeshStandardMaterial({
      map: texture,
      metalness: 0.3,
      roughness: 0.4,
      emissive: new THREE.Color(color).multiplyScalar(0.1),
      emissiveIntensity: 0.5
    });
  }

  createBackMaterial() {
    const color = this.data ? this.data.color : this.getRandomColor();
    
    return new THREE.MeshStandardMaterial({
      color: this.shadeColor(color, -40),
      metalness: 0.2,
      roughness: 0.5
    });
  }

  createSideMaterial() {
    const color = this.data ? this.data.color : this.getRandomColor();
    
    return new THREE.MeshStandardMaterial({
      color: this.shadeColor(color, -20),
      metalness: 0.2,
      roughness: 0.5
    });
  }

  getRandomColor() {
    const colors = [
      '#e94560', '#0f3460', '#e94560', '#16213e',
      '#533483', '#00d9ff', '#ff6b6b', '#4ecdc4',
      '#45b7d1', '#f7dc6f', '#bb8fce', '#85c1e9'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  shadeColor(color, percent) {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    
    return '#' + (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    ).toString(16).slice(1);
  }

  addTextLabel() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, 256, 64);
    
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 28px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`卡片 ${this.index + 1}`, 128, 32);
    
    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.set(0, this.height / 2 + 0.3, 0);
    sprite.scale.set(1, 0.25, 1);
    
    this.group.add(sprite);
  }

  setPosition(x, y, z) {
    this.targetPosition = { x, y, z };
  }

  setRotation(x, y) {
    this.targetRotation = { x, y };
  }

  setHovered(hovered) {
    this.hovered = hovered;
    this.targetHoverScale = hovered ? 1.15 : 1;
  }

  update() {
    this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * 0.1;
    this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * 0.1;
    
    this.currentPosition.x += (this.targetPosition.x - this.currentPosition.x) * 0.08;
    this.currentPosition.y += (this.targetPosition.y - this.currentPosition.y) * 0.08;
    this.currentPosition.z += (this.targetPosition.z - this.currentPosition.z) * 0.08;
    
    this.hoverScale += (this.targetHoverScale - this.hoverScale) * 0.1;
    
    if (this.group) {
      this.group.rotation.x = this.currentRotation.x;
      this.group.rotation.y = this.currentRotation.y;
      this.group.position.x = this.currentPosition.x;
      this.group.position.y = this.currentPosition.y;
      this.group.position.z = this.currentPosition.z;
      this.group.scale.set(this.hoverScale, this.hoverScale, this.hoverScale);
    }
  }

  getGroup() {
    return this.group;
  }

  getMesh() {
    return this.mesh;
  }

  getIndex() {
    return this.index;
  }

  getData() {
    return this.data;
  }

  dispose() {
    if (this.mesh) {
      this.mesh.geometry.dispose();
      if (Array.isArray(this.mesh.material)) {
        this.mesh.material.forEach(mat => mat.dispose());
      } else {
        this.mesh.material.dispose();
      }
    }
    
    if (this.group) {
      this.group.traverse((child) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(mat => mat.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
    }
    
    this.mesh = null;
    this.group = null;
  }
}

export const LayoutType = {
  GRID: 'grid',
  CIRCLE: 'circle',
  WAVE: 'wave'
};

export class CardManager {
  constructor(sceneManager, cardData = []) {
    this.sceneManager = sceneManager;
    this.cards = [];
    this.cardData = cardData;
    this.localStorageKey = '3d-card-hover-data';
    
    this.gap = 0.5;
    this.isMobile = window.innerWidth <= 768;
    this.currentLayout = LayoutType.GRID;
    this.animationTime = 0;
    this.circleRotationSpeed = 0.2;
    this.waveAmplitude = 1.5;
    this.waveFrequency = 0.8;
    
    this.init();
  }

  init() {
    this.loadFromLocalStorage();
    this.createCards();
    this.setupEventListeners();
    this.setupAnimationLoop();
  }

  createCards() {
    if (this.cardData.length === 0) {
      this.cardData = this.getDefaultCardData();
    }
    
    this.cards.forEach(card => {
      this.sceneManager.remove(card.getGroup());
      card.dispose();
    });
    this.cards = [];
    
    this.cardData.forEach((data, index) => {
      const card = new CardModel(index, data);
      this.cards.push(card);
      this.sceneManager.add(card.getGroup());
    });
    
    this.arrangeCards();
  }

  addCard(cardData) {
    const newData = {
      title: cardData.title || '新卡片',
      description: cardData.description || '卡片描述',
      color: cardData.color || this.getRandomColor()
    };
    
    this.cardData.push(newData);
    
    const newIndex = this.cards.length;
    const card = new CardModel(newIndex, newData);
    this.cards.push(card);
    this.sceneManager.add(card.getGroup());
    
    this.updateCardIndices();
    this.arrangeCards();
    this.saveToLocalStorage();
    
    return card;
  }

  removeCard(index) {
    if (index < 0 || index >= this.cards.length) {
      return false;
    }
    
    const cardToRemove = this.cards[index];
    this.sceneManager.remove(cardToRemove.getGroup());
    cardToRemove.dispose();
    
    this.cards.splice(index, 1);
    this.cardData.splice(index, 1);
    
    this.updateCardIndices();
    this.arrangeCards();
    this.saveToLocalStorage();
    
    return true;
  }

  updateCard(index, cardData) {
    if (index < 0 || index >= this.cards.length) {
      return false;
    }
    
    const currentData = this.cardData[index];
    const newData = {
      title: cardData.title !== undefined ? cardData.title : currentData.title,
      description: cardData.description !== undefined ? cardData.description : currentData.description,
      color: cardData.color !== undefined ? cardData.color : currentData.color
    };
    
    this.cardData[index] = newData;
    
    const oldCard = this.cards[index];
    this.sceneManager.remove(oldCard.getGroup());
    oldCard.dispose();
    
    const newCard = new CardModel(index, newData);
    this.cards[index] = newCard;
    this.sceneManager.add(newCard.getGroup());
    
    this.arrangeCards();
    this.saveToLocalStorage();
    
    return true;
  }

  getCardData(index) {
    if (index < 0 || index >= this.cardData.length) {
      return null;
    }
    return { ...this.cardData[index] };
  }

  getAllCardData() {
    return this.cardData.map(data => ({ ...data }));
  }

  updateCardIndices() {
    this.cards.forEach((card, index) => {
      card.index = index;
    });
  }

  resetToDefault() {
    this.cardData = this.getDefaultCardData();
    this.createCards();
    this.saveToLocalStorage();
  }

  saveToLocalStorage() {
    try {
      localStorage.setItem(this.localStorageKey, JSON.stringify(this.cardData));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  }

  loadFromLocalStorage() {
    try {
      const saved = localStorage.getItem(this.localStorageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.cardData = parsed;
          return true;
        }
      }
    } catch (e) {
      console.warn('Failed to load from localStorage:', e);
    }
    return false;
  }

  getDefaultCardData() {
    return [
      { title: '创新设计', description: '精美的 3D 视觉效果', color: '#e94560' },
      { title: '响应式布局', description: '完美适配各种设备', color: '#0f3460' },
      { title: '流畅动画', description: '丝滑的交互体验', color: '#4ecdc4' },
      { title: '现代技术', description: 'Three.js + Vite + Tailwind', color: '#45b7d1' },
      { title: '模块化设计', description: '清晰的代码结构', color: '#9b59b6' },
      { title: '性能优化', description: '高效的渲染性能', color: '#e67e22' }
    ];
  }

  setLayout(layoutType) {
    if (Object.values(LayoutType).includes(layoutType)) {
      this.currentLayout = layoutType;
      this.arrangeCards();
    }
  }

  getLayout() {
    return this.currentLayout;
  }

  nextLayout() {
    const layouts = Object.values(LayoutType);
    const currentIndex = layouts.indexOf(this.currentLayout);
    const nextIndex = (currentIndex + 1) % layouts.length;
    this.setLayout(layouts[nextIndex]);
    return layouts[nextIndex];
  }

  prevLayout() {
    const layouts = Object.values(LayoutType);
    const currentIndex = layouts.indexOf(this.currentLayout);
    const prevIndex = (currentIndex - 1 + layouts.length) % layouts.length;
    this.setLayout(layouts[prevIndex]);
    return layouts[prevIndex];
  }

  arrangeCards() {
    switch (this.currentLayout) {
      case LayoutType.CIRCLE:
        this.arrangeCircleLayout();
        break;
      case LayoutType.WAVE:
        this.arrangeWaveLayout();
        break;
      case LayoutType.GRID:
      default:
        this.arrangeGridLayout();
        break;
    }
  }

  arrangeGridLayout() {
    const count = this.cards.length;
    const isMobile = window.innerWidth <= 768;
    
    let cols, rows;
    
    if (isMobile) {
      cols = 1;
      rows = count;
    } else {
      cols = Math.ceil(Math.sqrt(count * 1.5));
      rows = Math.ceil(count / cols);
    }
    
    const cardWidth = 2 + this.gap;
    const cardHeight = 3 + this.gap;
    
    const totalWidth = cols * cardWidth - this.gap;
    const totalHeight = rows * cardHeight - this.gap;
    
    const startX = -totalWidth / 2 + cardWidth / 2;
    const startY = totalHeight / 2 - cardHeight / 2;
    
    this.cards.forEach((card, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      
      const x = startX + col * cardWidth;
      const y = startY - row * cardHeight;
      
      card.setPosition(x, y, 0);
      card.setRotation(0, 0);
    });
  }

  arrangeCircleLayout() {
    const count = this.cards.length;
    const radius = this.isMobile ? 5 : 6;
    
    this.cards.forEach((card, index) => {
      const angle = (index / count) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius * 0.6;
      const z = Math.sin(angle) * 2;
      
      const rotationY = -angle + Math.PI / 2;
      
      card.setPosition(x, y, z);
      card.setRotation(0, rotationY);
    });
  }

  arrangeWaveLayout() {
    const count = this.cards.length;
    const isMobile = window.innerWidth <= 768;
    const spacing = isMobile ? 2.8 : 2.5;
    
    const totalWidth = (count - 1) * spacing;
    const startX = -totalWidth / 2;
    
    this.cards.forEach((card, index) => {
      const x = startX + index * spacing;
      const y = Math.sin(index * this.waveFrequency) * this.waveAmplitude;
      const z = Math.cos(index * this.waveFrequency * 0.5) * 0.5;
      
      const rotationX = Math.sin(index * 0.5) * 0.3;
      const rotationY = Math.cos(index * 0.3) * 0.4;
      
      card.setPosition(x, y, z);
      card.setRotation(rotationX, rotationY);
    });
  }

  setupAnimationLoop() {
    this.sceneManager.addUpdateCallback(() => {
      this.animationTime += 0.016;
      this.updateDynamicLayout();
    });
  }

  updateDynamicLayout() {
    if (this.currentLayout === LayoutType.CIRCLE) {
      this.updateCircleAnimation();
    } else if (this.currentLayout === LayoutType.WAVE) {
      this.updateWaveAnimation();
    }
  }

  updateCircleAnimation() {
    const count = this.cards.length;
    const radius = this.isMobile ? 5 : 6;
    
    this.cards.forEach((card, index) => {
      const baseAngle = (index / count) * Math.PI * 2;
      const angle = baseAngle + this.animationTime * this.circleRotationSpeed;
      
      const targetX = Math.cos(angle) * radius;
      const targetY = Math.sin(angle) * radius * 0.6;
      const targetZ = Math.sin(angle) * 2;
      
      const targetRotationY = -angle + Math.PI / 2;
      
      card.targetPosition.x = targetX;
      card.targetPosition.y = targetY;
      card.targetPosition.z = targetZ;
      card.targetRotation.y = targetRotationY;
    });
  }

  updateWaveAnimation() {
    const count = this.cards.length;
    const isMobile = window.innerWidth <= 768;
    const spacing = isMobile ? 2.8 : 2.5;
    
    const totalWidth = (count - 1) * spacing;
    const startX = -totalWidth / 2;
    
    this.cards.forEach((card, index) => {
      const x = startX + index * spacing;
      const y = Math.sin(index * this.waveFrequency + this.animationTime) * this.waveAmplitude;
      const z = Math.cos(index * this.waveFrequency * 0.5 + this.animationTime * 0.5) * 0.5;
      
      const rotationX = Math.sin(index * 0.5 + this.animationTime * 0.3) * 0.3;
      const rotationY = Math.cos(index * 0.3 + this.animationTime * 0.2) * 0.4;
      
      card.targetPosition.x = x;
      card.targetPosition.y = y;
      card.targetPosition.z = z;
      card.targetRotation.x = rotationX;
      card.targetRotation.y = rotationY;
    });
  }

  setupEventListeners() {
    window.addEventListener('resize', () => this.onResize());
  }

  onResize() {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth <= 768;
    
    if (wasMobile !== this.isMobile) {
      this.arrangeCards();
    }
  }

  getCards() {
    return this.cards;
  }

  getCardCount() {
    return this.cards.length;
  }

  getCard(index) {
    return this.cards[index];
  }

  update() {
    this.cards.forEach(card => card.update());
  }

  dispose() {
    window.removeEventListener('resize', () => this.onResize());
    
    this.cards.forEach(card => {
      this.sceneManager.remove(card.getGroup());
      card.dispose();
    });
    
    this.cards = [];
  }
}
