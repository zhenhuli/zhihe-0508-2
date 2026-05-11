export const LEVELS = {
  easy: {
    name: '简单',
    pairs: 4,
    gridCols: 4,
    gridRows: 2,
    description: '4对卡牌，8张牌'
  },
  medium: {
    name: '中等',
    pairs: 8,
    gridCols: 4,
    gridRows: 4,
    description: '8对卡牌，16张牌'
  },
  hard: {
    name: '困难',
    pairs: 12,
    gridCols: 6,
    gridRows: 4,
    description: '12对卡牌，24张牌'
  },
  expert: {
    name: '专家',
    pairs: 18,
    gridCols: 6,
    gridRows: 6,
    description: '18对卡牌，36张牌'
  }
}

export const THEME_SYMBOLS = {
  animals: [
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
    '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔',
    '🐧', '🐦', '🐤', '🦆', '🦅', '🦉', '🦇', '🐺',
    '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞',
    '🐜', '🐢', '🐙', '🦀'
  ],
  fruits: [
    '🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈',
    '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆',
    '🥑', '🥦', '🥬', '🥒', '🌶', '🌽', '🥕', '🧄',
    '🧅', '🥔', '🍠', '🥐', '🍞', '🥖', '🥨', '🧀',
    '🥚', '🍳', '🧈', '🥞'
  ],
  sports: [
    '⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱',
    '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅',
    '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽',
    '🛹', '🛷', '⛸', '🥌', '🎿', '⛷', '🏂', '🪂',
    '💺', '🚁', '✈️', '🚀'
  ],
  nature: [
    '🌸', '🌺', '🌻', '🌹', '🌷', '💐', '🌿', '🍀',
    '🌴', '🌲', '🌳', '🌵', '🌾', '🌻', '🍁', '🍂',
    '🍃', '🌊', '🌙', '⭐', '☀️', '🌈', '⛅', '❄️',
    '🔥', '💧', '🌎', '🌍', '🌏', '🗻', '🏔️', '⛰️',
    '🌋', '🏝️', '🏜️', '🏞️'
  ]
}

export const THEMES = {
  animals: {
    name: '动物',
    icon: '🐾'
  },
  fruits: {
    name: '水果',
    icon: '🍎'
  },
  sports: {
    name: '运动',
    icon: '⚽'
  },
  nature: {
    name: '自然',
    icon: '🌿'
  }
}

export function getLevelConfig(level) {
  return LEVELS[level] || LEVELS.medium
}

export function getThemeSymbols(theme, count) {
  const symbols = THEME_SYMBOLS[theme] || THEME_SYMBOLS.animals
  return symbols.slice(0, count)
}
