import './style.css';
import {
  Scene,
  Lighting,
  CardManager,
  MouseInteraction,
  Carousel,
  LayoutType
} from './modules/index.js';

class App {
  constructor() {
    this.sceneManager = null;
    this.lighting = null;
    this.cardManager = null;
    this.mouseInteraction = null;
    this.carousel = null;
    
    this.init();
  }

  init() {
    this.setupScene();
    this.setupLighting();
    this.setupCards();
    this.setupMouseInteraction();
    this.setupCarousel();
    this.setupControls();
    this.setupCardEditor();
    this.start();
  }

  setupScene() {
    const container = document.getElementById('canvas-container');
    if (!container) {
      console.error('Canvas container not found');
      return;
    }
    
    this.sceneManager = new Scene(container);
  }

  setupLighting() {
    if (this.sceneManager) {
      this.lighting = new Lighting(this.sceneManager);
    }
  }

  setupCards() {
    if (this.sceneManager) {
      this.cardManager = new CardManager(this.sceneManager);
      
      this.sceneManager.addUpdateCallback(() => {
        if (this.cardManager) {
          this.cardManager.update();
        }
      });
    }
  }

  setupMouseInteraction() {
    if (this.sceneManager && this.cardManager) {
      this.mouseInteraction = new MouseInteraction(
        this.sceneManager,
        this.cardManager
      );
      
      this.mouseInteraction.setOnCardHover((card, isHovered) => {
        if (isHovered && this.carousel) {
          this.carousel.stop();
        }
      });
      
      this.mouseInteraction.setOnCardClick((card) => {
        console.log('Card clicked:', card.getData());
        if (this.carousel) {
          this.carousel.goTo(card.getIndex());
        }
      });
    }
  }

  setupCarousel() {
    if (this.sceneManager && this.cardManager) {
      this.carousel = new Carousel(
        this.sceneManager,
        this.cardManager,
        {
          autoPlay: true,
          interval: 4000
        }
      );
      
      this.carousel.setOnChange((index) => {
        console.log('Current card:', index + 1);
      });
      
      this.carousel.setOnPlay(() => {
        const autoPlayBtn = document.getElementById('autoPlayBtn');
        if (autoPlayBtn) {
          autoPlayBtn.textContent = '暂停自动轮播';
        }
      });
      
      this.carousel.setOnPause(() => {
        const autoPlayBtn = document.getElementById('autoPlayBtn');
        if (autoPlayBtn) {
          autoPlayBtn.textContent = '开始自动轮播';
        }
      });
    }
  }

  setupControls() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const autoPlayBtn = document.getElementById('autoPlayBtn');
    
    if (prevBtn && this.carousel) {
      prevBtn.addEventListener('click', () => {
        this.carousel.prev();
        this.carousel.stop();
      });
    }
    
    if (nextBtn && this.carousel) {
      nextBtn.addEventListener('click', () => {
        this.carousel.next();
        this.carousel.stop();
      });
    }
    
    if (autoPlayBtn && this.carousel) {
      autoPlayBtn.addEventListener('click', () => {
        this.carousel.toggle();
      });
    }
    
    this.setupLayoutControls();
  }
  
  setupLayoutControls() {
    const gridBtn = document.getElementById('gridLayoutBtn');
    const circleBtn = document.getElementById('circleLayoutBtn');
    const waveBtn = document.getElementById('waveLayoutBtn');
    
    const setActiveLayoutBtn = (activeBtn) => {
      [gridBtn, circleBtn, waveBtn].forEach(btn => {
        if (btn) {
          btn.classList.remove('active');
        }
      });
      if (activeBtn) {
        activeBtn.classList.add('active');
      }
    };
    
    if (gridBtn) {
      gridBtn.addEventListener('click', () => {
        if (this.cardManager) {
          this.cardManager.setLayout(LayoutType.GRID);
          setActiveLayoutBtn(gridBtn);
        }
      });
    }
    
    if (circleBtn) {
      circleBtn.addEventListener('click', () => {
        if (this.cardManager) {
          this.cardManager.setLayout(LayoutType.CIRCLE);
          setActiveLayoutBtn(circleBtn);
        }
      });
    }
    
    if (waveBtn) {
      waveBtn.addEventListener('click', () => {
        if (this.cardManager) {
          this.cardManager.setLayout(LayoutType.WAVE);
          setActiveLayoutBtn(waveBtn);
        }
      });
    }
  }

  start() {
    if (this.sceneManager) {
      this.sceneManager.start();
    }
  }

  stop() {
    if (this.sceneManager) {
      this.sceneManager.stop();
    }
  }

  setupCardEditor() {
    if (!this.cardManager) return;
    
    const toggleBtn = document.getElementById('togglePanelBtn');
    const panel = document.getElementById('cardEditorPanel');
    const closePanelBtn = document.getElementById('closePanelBtn');
    
    const openPanel = () => {
      if (panel) {
        panel.classList.add('open');
      }
      this.refreshCardList();
    };
    
    const closePanel = () => {
      if (panel) {
        panel.classList.remove('open');
      }
    };
    
    if (toggleBtn) {
      toggleBtn.addEventListener('click', openPanel);
    }
    
    if (closePanelBtn) {
      closePanelBtn.addEventListener('click', closePanel);
    }
    
    this.setupAddCardForm();
    this.setupEditCardModal();
    this.setupResetButton();
    this.refreshCardList();
  }
  
  setupAddCardForm() {
    if (!this.cardManager) return;
    
    const form = document.getElementById('addCardForm');
    const titleInput = document.getElementById('newCardTitle');
    const descInput = document.getElementById('newCardDesc');
    const colorInput = document.getElementById('newCardColor');
    const colorValue = document.getElementById('newCardColorValue');
    
    if (colorInput && colorValue) {
      colorInput.addEventListener('input', (e) => {
        colorValue.textContent = e.target.value;
      });
    }
    
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const title = titleInput ? titleInput.value.trim() : '';
        const description = descInput ? descInput.value.trim() : '';
        const color = colorInput ? colorInput.value : '#e94560';
        
        if (title) {
          this.cardManager.addCard({
            title: title,
            description: description || '卡片描述',
            color: color
          });
          
          if (titleInput) titleInput.value = '';
          if (descInput) descInput.value = '';
          if (colorInput) colorInput.value = '#e94560';
          if (colorValue) colorValue.textContent = '#e94560';
          
          this.refreshCardList();
        }
      });
    }
  }
  
  setupEditCardModal() {
    if (!this.cardManager) return;
    
    const modal = document.getElementById('editModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelBtn = document.getElementById('cancelEditBtn');
    const form = document.getElementById('editCardForm');
    const indexInput = document.getElementById('editCardIndex');
    const titleInput = document.getElementById('editCardTitle');
    const descInput = document.getElementById('editCardDesc');
    const colorInput = document.getElementById('editCardColor');
    const colorValue = document.getElementById('editCardColorValue');
    
    const openModal = (index) => {
      const cardData = this.cardManager.getCardData(index);
      if (!cardData || !modal) return;
      
      if (indexInput) indexInput.value = index;
      if (titleInput) titleInput.value = cardData.title;
      if (descInput) descInput.value = cardData.description;
      if (colorInput) colorInput.value = cardData.color;
      if (colorValue) colorValue.textContent = cardData.color;
      
      modal.classList.remove('hidden');
    };
    
    const closeModal = () => {
      if (modal) {
        modal.classList.add('hidden');
      }
    };
    
    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', closeModal);
    }
    
    if (cancelBtn) {
      cancelBtn.addEventListener('click', closeModal);
    }
    
    if (colorInput && colorValue) {
      colorInput.addEventListener('input', (e) => {
        colorValue.textContent = e.target.value;
      });
    }
    
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeModal();
        }
      });
    }
    
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const index = indexInput ? parseInt(indexInput.value) : -1;
        const title = titleInput ? titleInput.value.trim() : '';
        const description = descInput ? descInput.value.trim() : '';
        const color = colorInput ? colorInput.value : '#e94560';
        
        if (index >= 0 && title) {
          this.cardManager.updateCard(index, {
            title: title,
            description: description || '卡片描述',
            color: color
          });
          
          closeModal();
          this.refreshCardList();
        }
      });
    }
    
    this.openEditModal = openModal;
  }
  
  setupResetButton() {
    if (!this.cardManager) return;
    
    const resetBtn = document.getElementById('resetCardsBtn');
    
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('确定要重置为默认卡片吗？您的自定义卡片将会丢失。')) {
          this.cardManager.resetToDefault();
          this.refreshCardList();
        }
      });
    }
  }
  
  refreshCardList() {
    if (!this.cardManager) return;
    
    const cardList = document.getElementById('cardList');
    const cardCount = document.getElementById('cardCount');
    
    if (!cardList) return;
    
    const allCards = this.cardManager.getAllCardData();
    
    if (cardCount) {
      cardCount.textContent = `共 ${allCards.length} 张`;
    }
    
    cardList.innerHTML = '';
    
    allCards.forEach((cardData, index) => {
      const cardItem = document.createElement('div');
      cardItem.className = 'card-item';
      
      cardItem.innerHTML = `
        <div class="card-color-preview" style="background: linear-gradient(135deg, ${cardData.color}, ${this.shadeColor(cardData.color, -30)})"></div>
        <div class="card-info">
          <div class="card-title">${this.escapeHtml(cardData.title)}</div>
          <div class="card-desc">${this.escapeHtml(cardData.description)}</div>
        </div>
        <div class="card-actions">
          <button class="edit-btn" data-index="${index}">✏️</button>
          <button class="delete-btn" data-index="${index}">🗑️</button>
        </div>
      `;
      
      const editBtn = cardItem.querySelector('.edit-btn');
      const deleteBtn = cardItem.querySelector('.delete-btn');
      
      if (editBtn && this.openEditModal) {
        editBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          e.preventDefault();
          this.openEditModal(index);
        });
      }
      
      if (deleteBtn) {
        deleteBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          e.preventDefault();
          
          const currentCardCount = this.cardManager.getCardCount();
          
          if (currentCardCount <= 1) {
            alert('至少需要保留一张卡片！');
            return;
          }
          
          const userConfirmed = confirm(`确定要删除"${cardData.title}"吗？\n此操作不可撤销。`);
          
          if (userConfirmed === true) {
            this.cardManager.removeCard(index);
            this.refreshCardList();
          }
        });
      }
      
      cardList.appendChild(cardItem);
    });
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
  
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  dispose() {
    if (this.carousel) {
      this.carousel.dispose();
    }
    
    if (this.mouseInteraction) {
      this.mouseInteraction.dispose();
    }
    
    if (this.cardManager) {
      this.cardManager.dispose();
    }
    
    if (this.lighting) {
      this.lighting.dispose();
    }
    
    if (this.sceneManager) {
      this.sceneManager.dispose();
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});

window.addEventListener('beforeunload', () => {
  if (window.app) {
    window.app.dispose();
  }
});
