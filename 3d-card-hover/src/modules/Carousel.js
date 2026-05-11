export class Carousel {
  constructor(sceneManager, cardManager, options = {}) {
    this.sceneManager = sceneManager;
    this.cardManager = cardManager;
    
    this.currentIndex = 0;
    this.isPlaying = options.autoPlay !== false;
    this.interval = options.interval || 3000;
    this.loop = options.loop !== false;
    
    this.timer = null;
    this.onChange = null;
    this.onPlay = null;
    this.onPause = null;
    
    this.init();
  }

  init() {
    if (this.isPlaying) {
      this.start();
    }
  }

  start() {
    if (this.timer) return;
    
    this.isPlaying = true;
    this.timer = setInterval(() => {
      this.next();
    }, this.interval);
    
    if (this.onPlay) {
      this.onPlay();
    }
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    
    this.isPlaying = false;
    
    if (this.onPause) {
      this.onPause();
    }
  }

  toggle() {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.start();
    }
  }

  next() {
    const cardCount = this.cardManager.getCardCount();
    if (cardCount === 0) return;
    
    this.currentIndex = (this.currentIndex + 1) % cardCount;
    this.highlightCurrentCard();
    
    if (this.onChange) {
      this.onChange(this.currentIndex);
    }
  }

  prev() {
    const cardCount = this.cardManager.getCardCount();
    if (cardCount === 0) return;
    
    this.currentIndex = (this.currentIndex - 1 + cardCount) % cardCount;
    this.highlightCurrentCard();
    
    if (this.onChange) {
      this.onChange(this.currentIndex);
    }
  }

  goTo(index) {
    const cardCount = this.cardManager.getCardCount();
    if (cardCount === 0) return;
    
    this.currentIndex = Math.max(0, Math.min(index, cardCount - 1));
    this.highlightCurrentCard();
    
    if (this.onChange) {
      this.onChange(this.currentIndex);
    }
  }

  highlightCurrentCard() {
    const cards = this.cardManager.getCards();
    cards.forEach((card, index) => {
      if (index === this.currentIndex) {
        card.setPosition(
          card.targetPosition.x,
          card.targetPosition.y,
          1
        );
        card.setRotation(0, 0);
      } else {
        card.setPosition(
          card.targetPosition.x,
          card.targetPosition.y,
          0
        );
      }
    });
  }

  setAutoPlay(enabled) {
    if (enabled) {
      this.start();
    } else {
      this.stop();
    }
  }

  setInterval(interval) {
    this.interval = interval;
    if (this.isPlaying) {
      this.stop();
      this.start();
    }
  }

  getCurrentIndex() {
    return this.currentIndex;
  }

  isAutoPlaying() {
    return this.isPlaying;
  }

  setOnChange(callback) {
    this.onChange = callback;
  }

  setOnPlay(callback) {
    this.onPlay = callback;
  }

  setOnPause(callback) {
    this.onPause = callback;
  }

  dispose() {
    this.stop();
    this.onChange = null;
    this.onPlay = null;
    this.onPause = null;
  }
}
