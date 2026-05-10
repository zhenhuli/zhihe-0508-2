export interface CheckInSession {
  id: string
  code: string
  className: string
  createdAt: number
  isActive: boolean
}

export interface CheckInRecord {
  id: string
  sessionId: string
  studentName: string
  checkedInAt: number
}

const sessions: Map<string, CheckInSession> = new Map()
const records: Map<string, CheckInRecord[]> = new Map()

export function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export function createSession(className: string): CheckInSession {
  const session: CheckInSession = {
    id: generateId(),
    code: generateCode(),
    className,
    createdAt: Date.now(),
    isActive: true
  }
  sessions.set(session.id, session)
  records.set(session.id, [])
  return session
}

export function getSessionById(id: string): CheckInSession | undefined {
  return sessions.get(id)
}

export function getSessionByCode(code: string): CheckInSession | undefined {
  for (const session of sessions.values()) {
    if (session.code === code && session.isActive) {
      return session
    }
  }
  return undefined
}

export function listActiveSessions(): CheckInSession[] {
  return Array.from(sessions.values())
    .filter(s => s.isActive)
    .sort((a, b) => b.createdAt - a.createdAt)
}

export function listAllSessions(): CheckInSession[] {
  return Array.from(sessions.values()).sort((a, b) => b.createdAt - a.createdAt)
}

export function closeSession(id: string): boolean {
  const session = sessions.get(id)
  if (session) {
    session.isActive = false
    return true
  }
  return false
}

export function checkIn(sessionId: string, studentName: string): CheckInRecord | null {
  const session = sessions.get(sessionId)
  if (!session || !session.isActive) {
    return null
  }
  
  const sessionRecords = records.get(sessionId) || []
  
  const existing = sessionRecords.find(r => r.studentName === studentName)
  if (existing) {
    return null
  }
  
  const record: CheckInRecord = {
    id: generateId(),
    sessionId,
    studentName,
    checkedInAt: Date.now()
  }
  
  sessionRecords.push(record)
  records.set(sessionId, sessionRecords)
  return record
}

export function getRecordsBySession(sessionId: string): CheckInRecord[] {
  return records.get(sessionId) || []
}

export function getAllRecords(): { session: CheckInSession, records: CheckInRecord[] }[] {
  const result: { session: CheckInSession, records: CheckInRecord[] }[] = []
  
  for (const [sessionId, sessionRecords] of records.entries()) {
    const session = sessions.get(sessionId)
    if (session) {
      result.push({ session, records: sessionRecords.sort((a, b) => b.checkedInAt - a.checkedInAt) })
    }
  }
  
  return result.sort((a, b) => b.session.createdAt - a.session.createdAt)
}
