function formatTime(timestamp: number): string {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const sessionId = query.sessionId as string
  
  let csvContent = '课程名称,签到码,昵称,签到时间\n'
  
  if (sessionId) {
    const session = getSessionById(sessionId)
    const records = getRecordsBySession(sessionId)
    
    if (!session) {
      throw createError({
        statusCode: 404,
        statusMessage: '会话不存在'
      })
    }
    
    for (const record of records) {
      csvContent += `${session.className},${session.code},${record.studentName},${formatTime(record.checkedInAt)}\n`
    }
  } else {
    const allRecords = getAllRecords()
    
    for (const { session, records } of allRecords) {
      for (const record of records) {
        csvContent += `${session.className},${session.code},${record.studentName},${formatTime(record.checkedInAt)}\n`
      }
    }
  }
  
  const fileName = `签到记录_${formatTime(Date.now()).replace(/[: ]/g, '-')}.csv`
  const encodedFileName = encodeURIComponent(fileName)
  
  setHeader(event, 'Content-Type', 'text/csv; charset=utf-8')
  setHeader(event, 'Content-Disposition', `attachment; filename*=UTF-8''${encodedFileName}`)
  
  return '\uFEFF' + csvContent
})
