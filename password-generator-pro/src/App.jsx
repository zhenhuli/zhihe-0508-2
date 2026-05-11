import { useState, useEffect, useCallback } from 'react'
import './App.css'

const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz'
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const NUMBERS = '0123456789'
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?'

function generatePassword(length, includeLower, includeUpper, includeNumbers, includeSymbols) {
  let charset = ''
  const requiredChars = []
  
  if (includeLower) {
    charset += LOWERCASE
    requiredChars.push(LOWERCASE[Math.floor(Math.random() * LOWERCASE.length)])
  }
  if (includeUpper) {
    charset += UPPERCASE
    requiredChars.push(UPPERCASE[Math.floor(Math.random() * UPPERCASE.length)])
  }
  if (includeNumbers) {
    charset += NUMBERS
    requiredChars.push(NUMBERS[Math.floor(Math.random() * NUMBERS.length)])
  }
  if (includeSymbols) {
    charset += SYMBOLS
    requiredChars.push(SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)])
  }
  
  if (charset === '') return ''
  
  let password = ''
  const remainingLength = length - requiredChars.length
  
  for (let i = 0; i < remainingLength; i++) {
    password += charset[Math.floor(Math.random() * charset.length)]
  }
  
  password += requiredChars.join('')
  
  return password.split('').sort(() => Math.random() - 0.5).join('')
}

function calculateStrength(password) {
  let score = 0
  
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (password.length >= 16) score++
  if (/[a-z]/.test(password)) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^a-zA-Z0-9]/.test(password)) score++
  
  return Math.min(score, 5)
}

function getStrengthLabel(score) {
  const labels = ['非常弱', '弱', '一般', '强', '非常强', '极佳']
  return labels[score] || '无效'
}

function getStrengthColor(score) {
  const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500', 'bg-emerald-500']
  return colors[score] || 'bg-gray-300'
}

function getStrengthTextColor(score) {
  const colors = ['text-red-500', 'text-orange-500', 'text-yellow-500', 'text-lime-500', 'text-green-500', 'text-emerald-500']
  return colors[score] || 'text-gray-500'
}

function App() {
  const [passwordLength, setPasswordLength] = useState(16)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [password, setPassword] = useState('')
  const [copied, setCopied] = useState(false)
  const [batchCount, setBatchCount] = useState(5)
  const [batchPasswords, setBatchPasswords] = useState([])
  const [copiedIndex, setCopiedIndex] = useState(-1)

  const generateSinglePassword = useCallback(() => {
    const newPassword = generatePassword(
      passwordLength,
      includeLowercase,
      includeUppercase,
      includeNumbers,
      includeSymbols
    )
    setPassword(newPassword)
    setCopied(false)
  }, [passwordLength, includeLowercase, includeUppercase, includeNumbers, includeSymbols])

  const generateBatchPasswords = useCallback(() => {
    const passwords = []
    for (let i = 0; i < batchCount; i++) {
      passwords.push(generatePassword(
        passwordLength,
        includeLowercase,
        includeUppercase,
        includeNumbers,
        includeSymbols
      ))
    }
    setBatchPasswords(passwords)
    setCopiedIndex(-1)
  }, [passwordLength, includeLowercase, includeUppercase, includeNumbers, includeSymbols, batchCount])

  useEffect(() => {
    generateSinglePassword()
  }, [generateSinglePassword])

  const copyToClipboard = async (text, index = -1) => {
    try {
      await navigator.clipboard.writeText(text)
      if (index === -1) {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } else {
        setCopiedIndex(index)
        setTimeout(() => setCopiedIndex(-1), 2000)
      }
    } catch (err) {
      console.error('复制失败:', err)
    }
  }

  const exportToCSV = () => {
    if (batchPasswords.length === 0) return
    
    const headers = ['序号', '密码']
    const rows = batchPasswords.map((pwd, index) => [index + 1, pwd])
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n')
    
    const BOM = '\uFEFF'
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    const now = new Date()
    const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`
    link.href = url
    link.download = `密码列表_${timestamp}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const strength = calculateStrength(password)
  const hasAnyOption = includeLowercase || includeUppercase || includeNumbers || includeSymbols

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">高级密码生成器</h1>
          <p className="text-gray-300">生成安全、随机的密码，保护您的账户安全</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 mb-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-gray-300 text-sm font-medium">密码长度: {passwordLength}</label>
            </div>
            <input
              type="range"
              min="4"
              max="64"
              value={passwordLength}
              onChange={(e) => setPasswordLength(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>4</span>
              <span>64</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <label className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
              <input
                type="checkbox"
                checked={includeLowercase}
                onChange={(e) => setIncludeLowercase(e.target.checked)}
                className="w-5 h-5 rounded accent-purple-500"
              />
              <span className="text-gray-300">小写字母 (a-z)</span>
            </label>
            
            <label className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
              <input
                type="checkbox"
                checked={includeUppercase}
                onChange={(e) => setIncludeUppercase(e.target.checked)}
                className="w-5 h-5 rounded accent-purple-500"
              />
              <span className="text-gray-300">大写字母 (A-Z)</span>
            </label>
            
            <label className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={(e) => setIncludeNumbers(e.target.checked)}
                className="w-5 h-5 rounded accent-purple-500"
              />
              <span className="text-gray-300">数字 (0-9)</span>
            </label>
            
            <label className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
              <input
                type="checkbox"
                checked={includeSymbols}
                onChange={(e) => setIncludeSymbols(e.target.checked)}
                className="w-5 h-5 rounded accent-purple-500"
              />
              <span className="text-gray-300">特殊字符 (!@#$)</span>
            </label>
          </div>

          {!hasAnyOption && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm text-center">
              请至少选择一种字符类型
            </div>
          )}
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">生成单个密码</h2>
          
          <div className="mb-4">
            <div className="flex items-center bg-gray-800 rounded-lg p-4 mb-4">
              <input
                type="text"
                value={password}
                readOnly
                className="flex-1 bg-transparent text-white text-lg font-mono outline-none"
                placeholder="生成的密码将显示在这里"
              />
              <button
                onClick={() => copyToClipboard(password)}
                disabled={!password}
                className="ml-3 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white rounded-lg transition-colors flex items-center space-x-2"
              >
                <span>{copied ? '已复制!' : '复制'}</span>
              </button>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300 text-sm font-medium">密码强度</span>
              <span className={`text-sm font-semibold ${getStrengthTextColor(strength)}`}>
                {getStrengthLabel(strength)}
              </span>
            </div>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className={`h-2 flex-1 rounded-full transition-colors ${
                    level <= strength ? getStrengthColor(strength) : 'bg-gray-700'
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={generateSinglePassword}
            disabled={!hasAnyOption}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold rounded-lg transition-all transform hover:scale-[1.02] disabled:scale-100"
          >
            重新生成密码
          </button>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">批量生成密码</h2>
            <div className="flex items-center space-x-2">
              <label className="text-gray-300 text-sm">数量:</label>
              <select
                value={batchCount}
                onChange={(e) => setBatchCount(Number(e.target.value))}
                className="bg-gray-700 text-white px-3 py-1 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
              >
                {[3, 5, 10, 15, 20].map((num) => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
          </div>

          {batchPasswords.length > 0 ? (
            <div className="space-y-2 mb-4 max-h-80 overflow-y-auto">
              {batchPasswords.map((pwd, index) => (
                <div
                  key={index}
                  className="flex items-center bg-gray-800 rounded-lg p-3 group"
                >
                  <span className="text-gray-500 text-sm w-8">#{index + 1}</span>
                  <input
                    type="text"
                    value={pwd}
                    readOnly
                    className="flex-1 bg-transparent text-white font-mono outline-none"
                  />
                  <button
                    onClick={() => copyToClipboard(pwd, index)}
                    className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  >
                    {copiedIndex === index ? '已复制!' : '复制'}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-8 mb-4">
              点击下方按钮生成 {batchCount} 个密码
            </div>
          )}

          <div className="flex space-x-3">
            <button
              onClick={generateBatchPasswords}
              disabled={!hasAnyOption}
              className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold rounded-lg transition-all transform hover:scale-[1.02] disabled:scale-100"
            >
              生成 {batchCount} 个密码
            </button>
            <button
              onClick={exportToCSV}
              disabled={batchPasswords.length === 0}
              className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold rounded-lg transition-all transform hover:scale-[1.02] disabled:scale-100"
            >
              导出 CSV
            </button>
          </div>
        </div>

        <div className="text-center mt-8 text-gray-400 text-sm">
          <p>💡 提示: 建议使用 12 位以上的密码，并包含多种字符类型</p>
        </div>
      </div>
    </div>
  )
}

export default App
