import { useState, useEffect, useCallback } from 'react'

function App() {
  const [activeTab, setActiveTab] = useState('text')
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [inputImage, setInputImage] = useState(null)
  const [outputImage, setOutputImage] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [history, setHistory] = useState([])
  const [copied, setCopied] = useState(false)
  const [mode, setMode] = useState('encode')

  useEffect(() => {
    const savedHistory = localStorage.getItem('base64-history')
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('base64-history', JSON.stringify(history))
  }, [history])

  const encodeText = useCallback(() => {
    if (!inputText.trim()) return
    try {
      const encoded = btoa(unescape(encodeURIComponent(inputText)))
      setOutputText(encoded)
      addToHistory({
        type: 'text',
        mode: 'encode',
        input: inputText,
        output: encoded,
        timestamp: new Date().toISOString()
      })
    } catch (e) {
      alert('编码失败')
    }
  }, [inputText])

  const decodeText = useCallback(() => {
    if (!inputText.trim()) return
    try {
      const decoded = decodeURIComponent(escape(atob(inputText.trim())))
      setOutputText(decoded)
      addToHistory({
        type: 'text',
        mode: 'decode',
        input: inputText,
        output: decoded,
        timestamp: new Date().toISOString()
      })
    } catch (e) {
      alert('解码失败，请检查输入是否为有效的Base64字符串')
    }
  }, [inputText])

  const addToHistory = (item) => {
    setHistory(prev => [item, ...prev.slice(0, 49)])
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('请上传图片文件')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target.result
      setInputImage(file)
      setImagePreview(base64)
      setOutputImage(base64)
      addToHistory({
        type: 'image',
        mode: 'encode',
        fileName: file.name,
        fileSize: file.size,
        output: base64.substring(0, 100) + '...',
        fullOutput: base64,
        timestamp: new Date().toISOString()
      })
    }
    reader.readAsDataURL(file)
  }

  const decodeBase64ToImage = () => {
    if (!inputText.trim()) return
    try {
      let base64Data = inputText.trim()
      if (!base64Data.startsWith('data:image/')) {
        base64Data = `data:image/png;base64,${base64Data}`
      }
      setImagePreview(base64Data)
      setOutputImage(base64Data)
      addToHistory({
        type: 'image',
        mode: 'decode',
        input: inputText.substring(0, 100) + '...',
        timestamp: new Date().toISOString()
      })
    } catch (e) {
      alert('解码失败，请检查输入是否为有效的图片Base64字符串')
    }
  }

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (e) {
      alert('复制失败')
    }
  }

  const clearAll = () => {
    setInputText('')
    setOutputText('')
    setInputImage(null)
    setOutputImage(null)
    setImagePreview('')
  }

  const loadFromHistory = (item) => {
    if (item.type === 'text') {
      setActiveTab('text')
      setInputText(item.input)
      setOutputText(item.output)
    } else {
      setActiveTab('image')
      if (item.fullOutput) {
        setImagePreview(item.fullOutput)
        setOutputImage(item.fullOutput)
      }
    }
  }

  const clearHistory = () => {
    if (confirm('确定要清空所有历史记录吗？')) {
      setHistory([])
    }
  }

  const downloadImage = () => {
    if (!imagePreview) return
    const link = document.createElement('a')
    link.href = imagePreview
    link.download = `decoded-image-${Date.now()}.png`
    link.click()
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Base64 工具</h1>
          <p className="text-white/80">多功能 Base64 编码解码工具</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => { setActiveTab('text'); clearAll() }}
                  className={`flex-1 py-4 px-6 font-medium transition-all ${
                    activeTab === 'text'
                      ? 'text-purple-600 bg-purple-50 border-b-2 border-purple-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    文本转换
                  </span>
                </button>
                <button
                  onClick={() => { setActiveTab('image'); clearAll() }}
                  className={`flex-1 py-4 px-6 font-medium transition-all ${
                    activeTab === 'image'
                      ? 'text-purple-600 bg-purple-50 border-b-2 border-purple-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    图片转换
                  </span>
                </button>
              </div>

              <div className="p-6">
                {activeTab === 'text' ? (
                  <div className="space-y-6">
                    <div className="flex gap-4 mb-4">
                      <button
                        onClick={() => { setMode('encode'); setOutputText('') }}
                        className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                          mode === 'encode'
                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        编码 (文本 → Base64)
                      </button>
                      <button
                        onClick={() => { setMode('decode'); setOutputText('') }}
                        className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                          mode === 'decode'
                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        解码 (Base64 → 文本)
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        输入 {mode === 'encode' ? '文本' : 'Base64'}
                      </label>
                      <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder={mode === 'encode' ? '请输入要编码的文本...' : '请输入要解码的Base64字符串...'}
                        className="w-full h-40 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-gray-800"
                      />
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={mode === 'encode' ? encodeText : decodeText}
                        className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                      >
                        {mode === 'encode' ? '🚀 编码' : '🔓 解码'}
                      </button>
                      <button
                        onClick={clearAll}
                        className="px-6 py-4 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-all"
                      >
                        清空
                      </button>
                    </div>

                    {outputText && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            输出结果
                          </label>
                          <button
                            onClick={() => copyToClipboard(outputText)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                              copied
                                ? 'bg-green-100 text-green-700'
                                : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                            }`}
                          >
                            {copied ? (
                              <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                已复制
                              </>
                            ) : (
                              <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                复制
                              </>
                            )}
                          </button>
                        </div>
                        <textarea
                          value={outputText}
                          readOnly
                          className="w-full h-40 p-4 border border-gray-300 rounded-xl bg-gray-50 resize-none text-gray-800 font-mono text-sm"
                        />
                        <p className="mt-2 text-sm text-gray-500">
                          字符数: {outputText.length}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex gap-4 mb-4">
                      <button
                        onClick={() => { setMode('encode'); clearAll() }}
                        className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                          mode === 'encode'
                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        编码 (图片 → Base64)
                      </button>
                      <button
                        onClick={() => { setMode('decode'); clearAll() }}
                        className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                          mode === 'decode'
                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        解码 (Base64 → 图片)
                      </button>
                    </div>

                    {mode === 'encode' ? (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          上传图片
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-500 transition-all cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="image-upload"
                          />
                          <label htmlFor="image-upload" className="cursor-pointer">
                            <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p className="text-gray-600 mb-2">点击或拖拽上传图片</p>
                            <p className="text-sm text-gray-400">支持 JPG, PNG, GIF, WebP 等格式</p>
                          </label>
                        </div>
                        {inputImage && (
                          <div className="mt-4 p-4 bg-green-50 rounded-xl">
                            <p className="text-green-700 font-medium">✓ 已加载: {inputImage.name}</p>
                            <p className="text-sm text-green-600">大小: {formatFileSize(inputImage.size)}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          输入图片 Base64 字符串
                        </label>
                        <textarea
                          value={inputText}
                          onChange={(e) => setInputText(e.target.value)}
                          placeholder="请输入图片的Base64字符串，可以包含 data:image 前缀..."
                          className="w-full h-32 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-gray-800 font-mono text-sm"
                        />
                        <button
                          onClick={decodeBase64ToImage}
                          className="mt-4 w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                        >
                          🔓 解码图片
                        </button>
                      </div>
                    )}

                    {imagePreview && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            图片预览
                          </label>
                          <div className="flex gap-2">
                            {mode === 'encode' && outputImage && (
                              <button
                                onClick={() => copyToClipboard(outputImage)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                  copied
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                                }`}
                              >
                                {copied ? '✓ 已复制' : '📋 复制Base64'}
                              </button>
                            )}
                            <button
                              onClick={downloadImage}
                              className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-all"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                              下载图片
                            </button>
                          </div>
                        </div>
                        <div className="border border-gray-300 rounded-xl p-4 bg-gray-50">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="max-w-full max-h-80 mx-auto rounded-lg shadow-md"
                          />
                        </div>
                        {mode === 'encode' && outputImage && (
                          <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Base64 结果
                            </label>
                            <textarea
                              value={outputImage}
                              readOnly
                              className="w-full h-24 p-3 border border-gray-300 rounded-xl bg-gray-50 resize-none text-gray-600 font-mono text-xs"
                            />
                            <p className="mt-2 text-sm text-gray-500">
                              Base64 长度: {(outputImage.length / 1024).toFixed(2)} KB
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden sticky top-8">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  历史记录
                </h2>
                {history.length > 0 && (
                  <button
                    onClick={clearHistory}
                    className="text-xs text-red-500 hover:text-red-700 font-medium"
                  >
                    清空
                  </button>
                )}
              </div>
              <div className="max-h-96 overflow-y-auto">
                {history.length === 0 ? (
                  <div className="p-8 text-center">
                    <svg className="w-12 h-12 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-gray-400 text-sm">暂无历史记录</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {history.map((item, index) => (
                      <div
                        key={index}
                        onClick={() => loadFromHistory(item)}
                        className="p-4 hover:bg-gray-50 cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            item.type === 'text'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {item.type === 'text' ? '文本' : '图片'}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            item.mode === 'encode'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-orange-100 text-orange-700'
                          }`}>
                            {item.mode === 'encode' ? '编码' : '解码'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {item.type === 'text' ? item.input : (item.fileName || item.input)}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(item.timestamp).toLocaleString('zh-CN')}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8 text-white/60 text-sm">
          <p>💡 提示：所有历史记录保存在本地浏览器中</p>
        </div>
      </div>
    </div>
  )
}

export default App
