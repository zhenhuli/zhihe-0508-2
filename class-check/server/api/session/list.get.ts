export default defineEventHandler(() => {
  const sessions = listAllSessions()
  
  return {
    success: true,
    sessions
  }
})
