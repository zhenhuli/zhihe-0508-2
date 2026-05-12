import { useState } from 'react'
import Clock from './components/Clock'
import ControlPanel from './components/ControlPanel'

function App() {
  const [faceStyle, setFaceStyle] = useState('classic')
  const [handColor, setHandColor] = useState('classic')
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div
      className={`min-h-screen w-full p-10 transition-colors duration-500 ${
        darkMode
          ? 'bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900'
          : 'bg-gradient-to-b from-slate-50 via-white to-slate-100'
      }`}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1
            className={`text-5xl font-extrabold mb-3 tracking-tight ${
              darkMode ? 'text-white' : 'text-slate-800'
            }`}
            style={{
              textShadow: darkMode 
                ? '0 4px 20px rgba(0,0,0,0.4)' 
                : '0 2px 10px rgba(0,0,0,0.08)',
            }}
          >
            模拟指针时钟
          </h1>
          <p
            className={`text-xl font-light ${
              darkMode ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            Analog Clock Collection
          </p>
        </div>

        <div className="text-center mb-10">
          <Clock
            faceStyle={faceStyle}
            handColor={handColor}
            darkMode={darkMode}
          />
        </div>

        <div className="mb-10">
          <ControlPanel
            faceStyle={faceStyle}
            setFaceStyle={setFaceStyle}
            handColor={handColor}
            setHandColor={setHandColor}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />
        </div>

        <div className="text-center">
          <p
            className={`text-sm font-medium ${
              darkMode ? 'text-slate-500' : 'text-slate-400'
            }`}
          >
            React + SVG 制作 • 秒针平滑转动 • 多种样式可选
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
