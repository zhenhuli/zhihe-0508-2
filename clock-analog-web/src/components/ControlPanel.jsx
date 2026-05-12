const faceStyles = [
  { id: 'classic', name: '经典', color: '#ffffff', desc: '简约白' },
  { id: 'modern', name: '现代', color: '#f8fafc', desc: '科技灰' },
  { id: 'luxury', name: '奢华', color: '#fbbf24', desc: '流金款' },
  { id: 'minimalist', name: '极简', color: '#ffffff', desc: '纯净版' },
  { id: 'dark', name: '暗黑', color: '#1e293b', desc: '夜间款' },
]

const handColorOptions = [
  { id: 'classic', name: '经典', colors: ['#1a1a1a', '#404040', '#dc2626'], desc: '黑红配' },
  { id: 'blue', name: '蓝色', colors: ['#1e3a8a', '#2563eb', '#60a5fa'], desc: '海洋风' },
  { id: 'green', name: '绿色', colors: ['#14532d', '#16a34a', '#4ade80'], desc: '森林系' },
  { id: 'gold', name: '金色', colors: ['#78350f', '#d97706', '#fbbf24'], desc: '土豪金' },
  { id: 'purple', name: '紫色', colors: ['#4c1d95', '#7c3aed', '#a78bfa'], desc: '神秘紫' },
]

const ControlPanel = ({
  faceStyle,
  setFaceStyle,
  handColor,
  setHandColor,
  darkMode,
  setDarkMode,
}) => {
  return (
    <div
      className={`w-full max-w-2xl mx-auto p-8 rounded-3xl transition-all duration-500 ${
        darkMode
          ? 'bg-gradient-to-br from-slate-800/80 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 shadow-2xl shadow-black/30'
          : 'bg-white/80 backdrop-blur-xl border border-slate-200/50 shadow-2xl shadow-slate-200/50'
      }`}
    >
      <h2
        className={`text-2xl font-bold mb-8 text-center ${
          darkMode ? 'text-white' : 'text-slate-800'
        }`}
        style={{
          textShadow: darkMode ? '0 2px 10px rgba(0,0,0,0.3)' : 'none',
        }}
      >
        🎨 时钟设置
      </h2>

      <div className="mb-8">
        <label
          className={`block text-base font-semibold mb-4 flex items-center gap-2 ${
            darkMode ? 'text-slate-300' : 'text-slate-700'
          }`}
        >
          <span className="text-xl">⏱️</span>
          表盘样式
        </label>
        <div className="grid grid-cols-5 gap-4">
          {faceStyles.map((style) => (
            <button
              key={style.id}
              onClick={() => setFaceStyle(style.id)}
              className={`group relative p-5 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-3 ${
                faceStyle === style.id
                  ? darkMode
                    ? 'border-blue-500 bg-blue-500/20 shadow-lg shadow-blue-500/20 scale-105'
                    : 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/20 scale-105'
                  : darkMode
                  ? 'border-slate-600/50 hover:border-slate-500 bg-slate-700/50 hover:bg-slate-700'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full border-2 shadow-lg transition-transform duration-300 group-hover:scale-110 ${
                  faceStyle === style.id ? 'ring-2 ring-blue-500/50 ring-offset-2 ring-offset-transparent' : ''
                }`}
                style={{
                  backgroundColor: style.color,
                  borderColor: style.id === 'dark' ? '#475569' : style.id === 'luxury' ? '#b45309' : '#d1d5db',
                  boxShadow: style.id === 'luxury' 
                    ? '0 4px 15px rgba(251,191,36,0.4)' 
                    : style.id === 'dark'
                    ? '0 4px 15px rgba(0,0,0,0.3)'
                    : '0 4px 10px rgba(0,0,0,0.1)',
                }}
              />
              <div className="text-center">
                <span
                  className={`text-sm font-bold block ${
                    darkMode ? 'text-slate-200' : 'text-slate-700'
                  }`}
                >
                  {style.name}
                </span>
                <span
                  className={`text-xs ${
                    darkMode ? 'text-slate-500' : 'text-slate-400'
                  }`}
                >
                  {style.desc}
                </span>
              </div>
              {faceStyle === style.id && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <label
          className={`block text-base font-semibold mb-4 flex items-center gap-2 ${
            darkMode ? 'text-slate-300' : 'text-slate-700'
          }`}
        >
          <span className="text-xl">🎯</span>
          指针配色
        </label>
        <div className="grid grid-cols-5 gap-4">
          {handColorOptions.map((color) => (
            <button
              key={color.id}
              onClick={() => setHandColor(color.id)}
              className={`group relative p-5 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-3 ${
                handColor === color.id
                  ? darkMode
                    ? 'border-blue-500 bg-blue-500/20 shadow-lg shadow-blue-500/20 scale-105'
                    : 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/20 scale-105'
                  : darkMode
                  ? 'border-slate-600/50 hover:border-slate-500 bg-slate-700/50 hover:bg-slate-700'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100'
              }`}
            >
              <div className={`flex gap-1.5 items-end transition-transform duration-300 group-hover:scale-110 ${
                handColor === color.id ? 'ring-2 ring-blue-500/50 ring-offset-2 ring-offset-transparent rounded-full px-3 py-2' : 'px-3 py-2'
              }`}>
                <div
                  className="w-2 h-8 rounded-full shadow-md"
                  style={{ backgroundColor: color.colors[0] }}
                />
                <div
                  className="w-2 h-10 rounded-full shadow-md"
                  style={{ backgroundColor: color.colors[1] }}
                />
                <div
                  className="w-2 h-12 rounded-full shadow-md"
                  style={{ backgroundColor: color.colors[2] }}
                />
              </div>
              <div className="text-center">
                <span
                  className={`text-sm font-bold block ${
                    darkMode ? 'text-slate-200' : 'text-slate-700'
                  }`}
                >
                  {color.name}
                </span>
                <span
                  className={`text-xs ${
                    darkMode ? 'text-slate-500' : 'text-slate-400'
                  }`}
                >
                  {color.desc}
                </span>
              </div>
              {handColor === color.id && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label
          className={`block text-base font-semibold mb-4 flex items-center gap-2 ${
            darkMode ? 'text-slate-300' : 'text-slate-700'
          }`}
        >
          <span className="text-xl">🌓</span>
          夜间模式
        </label>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`w-full p-6 rounded-2xl flex items-center justify-between transition-all duration-300 ${
            darkMode
              ? 'bg-gradient-to-r from-indigo-600/30 to-purple-600/30 hover:from-indigo-600/40 hover:to-purple-600/40 border border-indigo-500/30'
              : 'bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 border border-amber-200'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl transition-all duration-300 ${
              darkMode ? 'bg-indigo-500/30 shadow-lg shadow-indigo-500/20' : 'bg-amber-100 shadow-lg shadow-amber-200/50'
            }`}>
              {darkMode ? '🌙' : '☀️'}
            </div>
            <div className="text-left">
              <span
                className={`text-lg font-bold block ${
                  darkMode ? 'text-white' : 'text-slate-800'
                }`}
              >
                {darkMode ? '夜间模式已开启' : '夜间模式已关闭'}
              </span>
              <span
                className={`text-sm ${
                  darkMode ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                {darkMode ? '保护眼睛，舒适观看' : '明亮清晰，活力满满'}
              </span>
            </div>
          </div>
          <div
            className={`w-16 h-9 rounded-full transition-all duration-300 relative shadow-inner ${
              darkMode ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : 'bg-gradient-to-r from-slate-300 to-slate-400'
            }`}
          >
            <div
              className={`absolute top-1 w-7 h-7 rounded-full bg-white shadow-lg transition-transform duration-300 flex items-center justify-center ${
                darkMode ? 'translate-x-8' : 'translate-x-1'
              }`}
            >
              <span className="text-sm">{darkMode ? '🌙' : '☀️'}</span>
            </div>
          </div>
        </button>
      </div>
    </div>
  )
}

export default ControlPanel
