export interface Word {
  id: string
  word: string
  pronunciation: string
  definition: string
  example: string
  chapterId: string
  language: string
  createdAt: number
  memorized: boolean
}

export interface Chapter {
  id: string
  name: string
  description: string
  language: string
  createdAt: number
}

export interface Language {
  code: string
  name: string
  flag: string
}
