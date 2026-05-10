import { describe, it, expect } from 'vitest'

describe('Basic Tests', () => {
  it('should pass basic test', () => {
    expect(1 + 1).toBe(2)
  })

  it('should handle string operations', () => {
    const message = '课堂签到系统'
    expect(message).toContain('签到')
    expect(message.length).toBe(6)
  })

  it('should work with arrays', () => {
    const students = ['张三', '李四', '王五']
    expect(students).toHaveLength(3)
    expect(students).toContain('李四')
  })
})
