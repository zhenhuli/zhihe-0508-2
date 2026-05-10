export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const sessionId = body.sessionId
  
  if (!sessionId) {
    throw createError({
      statusCode: 400,
      statusMessage: '缺少会话ID'
    })
  }
  
  const success = closeSession(sessionId)
  
  if (!success) {
    throw createError({
      statusCode: 404,
      statusMessage: '会话不存在'
    })
  }
  
  return {
    success: true
  }
})
