import { getLevelConfig, getThemeSymbols } from './levels.js'

export class CardRenderer {
  constructor(container) {
    this.container = container
  }

  render(level, theme, onCardClick) {
    const config = getLevelConfig(level)
    const symbols = getThemeSymbols(theme, config.pairs)
    const cards = this.createCards(symbols)
    this.shuffle(cards)
    
    this.container.innerHTML = ''
    this.container.style.gridTemplateColumns = `repeat(${config.gridCols}, 1fr)`
    this.container.className = 'card-grid'
    this.container.dataset.theme = theme
    
    cards.forEach((card, index) => {
      const cardElement = this.createCardElement(card, index)
      cardElement.addEventListener('click', () => onCardClick(index, card))
      this.container.appendChild(cardElement)
    })
  }

  createCards(symbols) {
    const cards = []
    symbols.forEach((symbol, index) => {
      cards.push({ id: index, symbol, matched: false })
      cards.push({ id: index, symbol, matched: false })
    })
    return cards
  }

  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]
    }
    return array
  }

  createCardElement(card, index) {
    const cardDiv = document.createElement('div')
    cardDiv.className = 'card'
    cardDiv.dataset.index = index
    cardDiv.dataset.id = card.id
    cardDiv.innerHTML = `
      <div class="card-inner">
        <div class="card-front">
          <span class="card-question">?</span>
        </div>
        <div class="card-back">
          <span class="card-symbol">${card.symbol}</span>
        </div>
      </div>
    `
    return cardDiv
  }

  flipCard(index, flip = true) {
    const card = this.container.querySelector(`[data-index="${index}"]`)
    if (card) {
      card.classList.toggle('flipped', flip)
    }
  }

  setMatched(index, matched = true) {
    const card = this.container.querySelector(`[data-index="${index}"]`)
    if (card) {
      card.classList.toggle('matched', matched)
    }
  }

  disableAll() {
    const cards = this.container.querySelectorAll('.card')
    cards.forEach(card => card.classList.add('disabled'))
  }

  enableAll() {
    const cards = this.container.querySelectorAll('.card')
    cards.forEach(card => card.classList.remove('disabled'))
  }

  resetAll() {
    const cards = this.container.querySelectorAll('.card')
    cards.forEach(card => {
      card.classList.remove('flipped', 'matched', 'disabled')
    })
  }
}
