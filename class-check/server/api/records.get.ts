export default defineEventHandler((event) => {
  const query = getQuery(event)
  const sessionId = query.sessionId as string
  
  if (sessionId) {
    const records = getRecordsBySession(sessionId)
    const session = getSessionById(sessionId)
    
    return {
      success: true,
      session,
      records
    }
  }
  
  const allRecords = getAllRecords()
  
  return {
    success: true,
    data: allRecords
  }
})
