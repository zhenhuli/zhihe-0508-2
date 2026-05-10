export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const className = body.className?.trim()
  
  if (!className) {
    throw createError({
      statusCode: 400,
      statusMessage: '请输入课程名称'
    })
  }
  
  const session = createSession(className)
  
  return {
    success: true,
    session
  }
})
