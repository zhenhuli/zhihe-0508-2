import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('h3', () => ({
  defineEventHandler: vi.fn(),
  readBody: vi.fn(),
  getQuery: vi.fn(),
  createError: vi.fn(),
  setHeader: vi.fn()
}))

describe('Store Utilities', () => {
  let storeModule: any

  beforeEach(async () => {
    const mod = await import('../../server/utils/store')
    storeModule = mod
  })

  describe('generateCode', () => {
    it('should generate 6-digit code', () => {
      const code = storeModule.generateCode()
      expect(code).toHaveLength(6)
      expect(/^\d{6}$/.test(code)).toBe(true)
    })

    it('should generate unique codes', () => {
      const codes = new Set()
      for (let i = 0; i < 100; i++) {
        codes.add(storeModule.generateCode())
      }
      expect(codes.size).toBeGreaterThan(90)
    })
  })

  describe('generateId', () => {
    it('should generate non-empty id', () => {
      const id = storeModule.generateId()
      expect(id).toBeTruthy()
      expect(typeof id).toBe('string')
      expect(id.length).toBeGreaterThan(0)
    })
  })

  describe('Session Management', () => {
    it('should create a new session', () => {
      const session = storeModule.createSession('高等数学')
      expect(session).toBeDefined()
      expect(session.id).toBeTruthy()
      expect(session.className).toBe('高等数学')
      expect(session.code).toHaveLength(6)
      expect(session.isActive).toBe(true)
      expect(session.createdAt).toBeGreaterThan(0)
    })

    it('should get session by id', () => {
      const created = storeModule.createSession('英语')
      const found = storeModule.getSessionById(created.id)
      expect(found).toEqual(created)
    })

    it('should get session by code', () => {
      const created = storeModule.createSession('物理')
      const found = storeModule.getSessionByCode(created.code)
      expect(found).toEqual(created)
    })

    it('should not find closed session by code', () => {
      const session = storeModule.createSession('化学')
      storeModule.closeSession(session.id)
      const found = storeModule.getSessionByCode(session.code)
      expect(found).toBeUndefined()
    })

    it('should list active sessions', () => {
      const s1 = storeModule.createSession('Session 1')
      const s2 = storeModule.createSession('Session 2')
      storeModule.closeSession(s1.id)
      
      const active = storeModule.listActiveSessions()
      expect(active.some(s => s.id === s2.id)).toBe(true)
      expect(active.some(s => s.id === s1.id)).toBe(false)
    })

    it('should close a session', () => {
      const session = storeModule.createSession('生物')
      expect(session.isActive).toBe(true)
      
      const result = storeModule.closeSession(session.id)
      expect(result).toBe(true)
      
      const updated = storeModule.getSessionById(session.id)
      expect(updated?.isActive).toBe(false)
    })

    it('should return false when closing non-existent session', () => {
      const result = storeModule.closeSession('non-existent-id')
      expect(result).toBe(false)
    })
  })

  describe('Check-in Management', () => {
    it('should check in a student', () => {
      const session = storeModule.createSession('体育')
      const record = storeModule.checkIn(session.id, '张三')
      
      expect(record).toBeDefined()
      expect(record?.studentName).toBe('张三')
      expect(record?.sessionId).toBe(session.id)
    })

    it('should not check in to closed session', () => {
      const session = storeModule.createSession('音乐')
      storeModule.closeSession(session.id)
      
      const record = storeModule.checkIn(session.id, '李四')
      expect(record).toBeNull()
    })

    it('should not allow duplicate check-in for same student', () => {
      const session = storeModule.createSession('美术')
      
      const first = storeModule.checkIn(session.id, '王五')
      expect(first).toBeDefined()
      
      const second = storeModule.checkIn(session.id, '王五')
      expect(second).toBeNull()
    })

    it('should get records by session', () => {
      const session = storeModule.createSession('历史')
      storeModule.checkIn(session.id, '学生A')
      storeModule.checkIn(session.id, '学生B')
      
      const records = storeModule.getRecordsBySession(session.id)
      expect(records.length).toBe(2)
      expect(records.some(r => r.studentName === '学生A')).toBe(true)
      expect(records.some(r => r.studentName === '学生B')).toBe(true)
    })
  })
})
