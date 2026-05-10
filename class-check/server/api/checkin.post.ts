export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const code = body.code?.trim()
  const studentName = body.studentName?.trim()
  
  if (!code) {
    throw createError({
      statusCode: 400,
      statusMessage: '请输入签到码'
    })
  }
  
  if (!studentName) {
    throw createError({
      statusCode: 400,
      statusMessage: '请输入昵称'
    })
  }
  
  const session = getSessionByCode(code)
  
  if (!session) {
    throw createError({
      statusCode: 404,
      statusMessage: '签到码无效或已过期'
    })
  }
  
  const record = checkIn(session.id, studentName)
  
  if (!record) {
    throw createError({
      statusCode: 400,
      statusMessage: '签到失败，可能是已签到过'
    })
  }
  
  return {
    success: true,
    record
  }
})
