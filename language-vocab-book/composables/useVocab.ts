import type { Word, Chapter, Language } from '~/types'
import { presetChapters, presetWords } from '~/data/presetWords'

const LANGUAGES: Language[] = [
  { code: 'en', name: '英语', flag: '🇺🇸' },
  { code: 'ja', name: '日语', flag: '🇯🇵' },
  { code: 'ko', name: '韩语', flag: '🇰🇷' },
  { code: 'fr', name: '法语', flag: '🇫🇷' },
  { code: 'de', name: '德语', flag: '🇩🇪' },
  { code: 'es', name: '西班牙语', flag: '🇪🇸' },
]

export const useVocab = () => {
  const words = useState<Word[]>('words', () => [])
  const chapters = useState<Chapter[]>('chapters', () => [])
  const currentLanguage = useState<string>('currentLanguage', () => 'en')

  const generateId = () => Math.random().toString(36).substr(2, 9)

  const addWord = (wordData: Omit<Word, 'id' | 'createdAt' | 'memorized'>) => {
    const newWord: Word = {
      ...wordData,
      id: generateId(),
      createdAt: Date.now(),
      memorized: false,
    }
    words.value = [...words.value, newWord]
    saveToStorage()
  }

  const updateWord = (id: string, updates: Partial<Word>) => {
    const index = words.value.findIndex(w => w.id === id)
    if (index !== -1) {
      const newWords = [...words.value]
      newWords[index] = { ...newWords[index], ...updates }
      words.value = newWords
      saveToStorage()
    }
  }

  const deleteWord = (id: string) => {
    words.value = words.value.filter(w => w.id !== id)
    saveToStorage()
  }

  const toggleMemorized = (id: string) => {
    const index = words.value.findIndex(w => w.id === id)
    if (index !== -1) {
      const newWords = [...words.value]
      newWords[index].memorized = !newWords[index].memorized
      words.value = newWords
      saveToStorage()
    }
  }

  const addChapter = (chapterData: Omit<Chapter, 'id' | 'createdAt'>) => {
    const newChapter: Chapter = {
      ...chapterData,
      id: generateId(),
      createdAt: Date.now(),
    }
    chapters.value = [...chapters.value, newChapter]
    saveToStorage()
  }

  const updateChapter = (id: string, updates: Partial<Chapter>) => {
    const index = chapters.value.findIndex(c => c.id === id)
    if (index !== -1) {
      const newChapters = [...chapters.value]
      newChapters[index] = { ...newChapters[index], ...updates }
      chapters.value = newChapters
      saveToStorage()
    }
  }

  const deleteChapter = (id: string) => {
    chapters.value = chapters.value.filter(c => c.id !== id)
    words.value = words.value.filter(w => w.chapterId !== id)
    saveToStorage()
  }

  const getWordsByChapter = (chapterId: string) => {
    return words.value.filter(w => w.chapterId === chapterId)
  }

  const getChaptersByLanguage = (language: string) => {
    return chapters.value.filter(c => c.language === language)
  }

  const speak = (text: string, language: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = language
      speechSynthesis.speak(utterance)
    }
  }

  const saveToStorage = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('vocab-words', JSON.stringify(words.value))
      localStorage.setItem('vocab-chapters', JSON.stringify(chapters.value))
      localStorage.setItem('vocab-language', currentLanguage.value)
    }
  }

  const importPresets = () => {
    chapters.value = [...presetChapters]
    words.value = [...presetWords]
    saveToStorage()
  }

  const loadFromStorage = () => {
    if (typeof window !== 'undefined') {
      const savedWords = localStorage.getItem('vocab-words')
      const savedChapters = localStorage.getItem('vocab-chapters')
      const savedLanguage = localStorage.getItem('vocab-language')
      const hasInitialized = localStorage.getItem('vocab-initialized')

      if (savedWords && savedWords !== '[]') {
        words.value = JSON.parse(savedWords)
      }
      if (savedChapters && savedChapters !== '[]') {
        chapters.value = JSON.parse(savedChapters)
      }
      if (savedLanguage) {
        currentLanguage.value = savedLanguage
      }

      if (!hasInitialized && words.value.length === 0 && chapters.value.length === 0) {
        importPresets()
        localStorage.setItem('vocab-initialized', 'true')
      }
    }
  }

  return {
    words,
    chapters,
    currentLanguage,
    LANGUAGES,
    addWord,
    updateWord,
    deleteWord,
    toggleMemorized,
    addChapter,
    updateChapter,
    deleteChapter,
    getWordsByChapter,
    getChaptersByLanguage,
    speak,
    loadFromStorage,
    importPresets,
  }
}
