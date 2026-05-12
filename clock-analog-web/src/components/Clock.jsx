import { useState, useEffect } from 'react'

const faceStyles = {
  classic: {
    name: '经典',
    bg: '#ffffff',
    bgGradient: ['#ffffff', '#f5f5f5'],
    border: '#2d2d2d',
    borderInner: '#666666',
    tickColor: '#333333',
    tickShadow: 'rgba(0,0,0,0.1)',
    numberColor: '#1a1a1a',
    numberShadow: 'rgba(0,0,0,0.15)',
    centerColor: '#1a1a1a',
    glassHighlight: 'rgba(255,255,255,0.25)',
  },
  modern: {
    name: '现代',
    bg: '#f8fafc',
    bgGradient: ['#ffffff', '#f1f5f9'],
    border: '#3b82f6',
    borderInner: '#60a5fa',
    tickColor: '#475569',
    tickShadow: 'rgba(59,130,246,0.1)',
    numberColor: '#1e293b',
    numberShadow: 'rgba(59,130,246,0.15)',
    centerColor: '#3b82f6',
    glassHighlight: 'rgba(59,130,246,0.1)',
  },
  luxury: {
    name: '奢华',
    bg: '#fef3c7',
    bgGradient: ['#fef3c7', '#fcd34d', '#f59e0b'],
    border: '#92400e',
    borderInner: '#d97706',
    tickColor: '#78350f',
    tickShadow: 'rgba(146,64,14,0.2)',
    numberColor: '#451a03',
    numberShadow: 'rgba(146,64,14,0.2)',
    centerColor: '#dc2626',
    glassHighlight: 'rgba(255,215,0,0.3)',
  },
  minimalist: {
    name: '极简',
    bg: '#ffffff',
    bgGradient: ['#ffffff', '#fafafa'],
    border: '#d4d4d8',
    borderInner: '#e4e4e7',
    tickColor: 'transparent',
    tickShadow: 'transparent',
    numberColor: '#27272a',
    numberShadow: 'rgba(0,0,0,0.08)',
    centerColor: '#18181b',
    glassHighlight: 'rgba(255,255,255,0.15)',
  },
  dark: {
    name: '暗黑',
    bg: '#1e293b',
    bgGradient: ['#334155', '#1e293b', '#0f172a'],
    border: '#475569',
    borderInner: '#64748b',
    tickColor: '#94a3b8',
    tickShadow: 'rgba(0,0,0,0.3)',
    numberColor: '#f1f5f9',
    numberShadow: 'rgba(0,0,0,0.4)',
    centerColor: '#3b82f6',
    glassHighlight: 'rgba(255,255,255,0.08)',
  },
}

const handColors = {
  classic: { hour: '#1a1a1a', minute: '#404040', second: '#dc2626', shadow: 'rgba(0,0,0,0.3)' },
  blue: { hour: '#1e3a8a', minute: '#2563eb', second: '#60a5fa', shadow: 'rgba(30,58,138,0.3)' },
  green: { hour: '#14532d', minute: '#16a34a', second: '#4ade80', shadow: 'rgba(20,83,45,0.3)' },
  gold: { hour: '#78350f', minute: '#d97706', second: '#fbbf24', shadow: 'rgba(120,53,15,0.3)' },
  purple: { hour: '#4c1d95', minute: '#7c3aed', second: '#a78bfa', shadow: 'rgba(76,29,149,0.3)' },
}

const Clock = ({ faceStyle, handColor, darkMode }) => {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const updateClock = () => {
      setTime(new Date())
    }
    
    const interval = setInterval(updateClock, 16)
    return () => clearInterval(interval)
  }, [])

  const hours = time.getHours() % 12
  const minutes = time.getMinutes()
  const seconds = time.getSeconds()
  const milliseconds = time.getMilliseconds()

  const secondAngle = (seconds + milliseconds / 1000) * 6
  const minuteAngle = (minutes + seconds / 60) * 6
  const hourAngle = (hours + minutes / 60) * 30

  const currentFace = faceStyles[faceStyle] || faceStyles.classic
  const currentHand = handColors[handColor] || handColors.classic

  const size = 420
  const center = size / 2
  const radius = size / 2 - 25

  const renderTicks = () => {
    const ticks = []
    for (let i = 0; i < 60; i++) {
      const angle = (i * 6 - 90) * (Math.PI / 180)
      const isHour = i % 5 === 0
      const tickLength = isHour ? 22 : 12
      const tickWidth = isHour ? 3.5 : 1.2
      const x1 = center + (radius - tickLength) * Math.cos(angle)
      const y1 = center + (radius - tickLength) * Math.sin(angle)
      const x2 = center + radius * Math.cos(angle)
      const y2 = center + radius * Math.sin(angle)

      if (isHour) {
        ticks.push(
          <g key={i}>
            <line
              x1={x1 + 1}
              y1={y1 + 1}
              x2={x2 + 1}
              y2={y2 + 1}
              stroke={currentFace.tickShadow}
              strokeWidth={tickWidth}
              strokeLinecap="round"
            />
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={currentFace.tickColor}
              strokeWidth={tickWidth}
              strokeLinecap="round"
            />
          </g>
        )
      } else if (currentFace.tickColor !== 'transparent') {
        ticks.push(
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={currentFace.tickColor}
            strokeWidth={tickWidth}
            strokeLinecap="round"
            opacity="0.6"
          />
        )
      }
    }
    return ticks
  }

  const renderNumbers = () => {
    const numbers = []
    for (let i = 1; i <= 12; i++) {
      const angle = (i * 30 - 90) * (Math.PI / 180)
      const textRadius = radius - 48
      const x = center + textRadius * Math.cos(angle)
      const y = center + textRadius * Math.sin(angle)

      numbers.push(
        <g key={i}>
          <text
            x={x + 1}
            y={y + 1}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={currentFace.numberShadow}
            fontSize="26"
            fontWeight="bold"
            fontFamily="'Georgia', 'Times New Roman', serif"
          >
            {i}
          </text>
          <text
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={currentFace.numberColor}
            fontSize="26"
            fontWeight="bold"
            fontFamily="'Georgia', 'Times New Roman', serif"
          >
            {i}
          </text>
        </g>
      )
    }
    return numbers
  }

  return (
    <div className="relative">
      <svg
        width={size}
        height={size}
        className="transition-all duration-300"
        style={{
          filter: `drop-shadow(0 25px 50px rgba(0,0,0,${darkMode ? '0.5' : '0.25'}))`,
        }}
      >
        <defs>
          <radialGradient id="outerCase" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#52525b" />
            <stop offset="70%" stopColor="#3f3f46" />
            <stop offset="100%" stopColor="#27272a" />
          </radialGradient>
          
          <linearGradient id="bevelGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a1a1aa" />
            <stop offset="50%" stopColor="#71717a" />
            <stop offset="100%" stopColor="#3f3f46" />
          </linearGradient>

          <radialGradient id="faceGradient" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor={currentFace.bgGradient[0]} />
            <stop offset="50%" stopColor={currentFace.bgGradient[1] || currentFace.bgGradient[0]} />
            <stop offset="100%" stopColor={currentFace.bgGradient[2] || currentFace.bgGradient[1] || currentFace.bgGradient[0]} />
          </radialGradient>

          <radialGradient id="innerShadow" cx="50%" cy="50%" r="50%">
            <stop offset="85%" stopColor="transparent" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.15)" />
          </radialGradient>

          <linearGradient id="glassReflection" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={currentFace.glassHighlight} stopOpacity="0.8" />
            <stop offset="30%" stopColor={currentFace.glassHighlight} stopOpacity="0.4" />
            <stop offset="60%" stopColor="transparent" />
          </linearGradient>

          <radialGradient id="centerCap" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#fafafa" />
            <stop offset="40%" stopColor={currentFace.centerColor} />
            <stop offset="100%" stopColor="#000000" />
          </radialGradient>

          <filter id="handShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="2" dy="3" stdDeviation="2" floodColor={currentHand.shadow} floodOpacity="0.5" />
          </filter>
        </defs>

        <circle
          cx={center}
          cy={center}
          r={radius + 28}
          fill="url(#outerCase)"
        />

        <circle
          cx={center}
          cy={center}
          r={radius + 20}
          fill="none"
          stroke="url(#bevelGradient)"
          strokeWidth="5"
        />

        <circle
          cx={center}
          cy={center}
          r={radius + 12}
          fill="none"
          stroke={currentFace.border}
          strokeWidth="3"
        />

        <circle
          cx={center}
          cy={center}
          r={radius + 8}
          fill="none"
          stroke={currentFace.borderInner}
          strokeWidth="1"
        />

        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="url(#faceGradient)"
        />

        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="url(#innerShadow)"
        />

        <circle
          cx={center}
          cy={center}
          r={radius - 8}
          fill="none"
          stroke={darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}
          strokeWidth="1"
        />

        <circle
          cx={center}
          cy={center}
          r={radius - 25}
          fill="none"
          stroke={darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'}
          strokeWidth="1"
        />

        {renderTicks()}
        {renderNumbers()}

        <g filter="url(#handShadow)">
          <line
            x1={center}
            y1={center + 5}
            x2={center}
            y2={center - 65}
            stroke={currentHand.hour}
            strokeWidth="10"
            strokeLinecap="round"
            style={{
              transform: `rotate(${hourAngle}deg)`,
              transformOrigin: `${center}px ${center}px`,
            }}
          />
          <line
            x1={center}
            y1={center + 5}
            x2={center}
            y2={center - 65}
            stroke={currentHand.hour}
            strokeWidth="5"
            strokeLinecap="round"
            strokeOpacity="0.3"
            style={{
              transform: `rotate(${hourAngle}deg)`,
              transformOrigin: `${center}px ${center}px`,
            }}
          />
        </g>

        <g filter="url(#handShadow)">
          <line
            x1={center}
            y1={center + 5}
            x2={center}
            y2={center - 95}
            stroke={currentHand.minute}
            strokeWidth="7"
            strokeLinecap="round"
            style={{
              transform: `rotate(${minuteAngle}deg)`,
              transformOrigin: `${center}px ${center}px`,
            }}
          />
          <line
            x1={center}
            y1={center + 5}
            x2={center}
            y2={center - 95}
            stroke={currentHand.minute}
            strokeWidth="3"
            strokeLinecap="round"
            strokeOpacity="0.3"
            style={{
              transform: `rotate(${minuteAngle}deg)`,
              transformOrigin: `${center}px ${center}px`,
            }}
          />
        </g>

        <g filter="url(#handShadow)">
          <line
            x1={center}
            y1={center + 25}
            x2={center}
            y2={center - 115}
            stroke={currentHand.second}
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{
              transform: `rotate(${secondAngle}deg)`,
              transformOrigin: `${center}px ${center}px`,
            }}
          />
          <circle
            cx={center}
            cy={center + 25}
            r="4"
            fill={currentHand.second}
            style={{
              transform: `rotate(${secondAngle}deg)`,
              transformOrigin: `${center}px ${center}px`,
            }}
          />
        </g>

        <circle
          cx={center}
          cy={center}
          r="14"
          fill="url(#centerCap)"
          style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
        />
        <circle
          cx={center}
          cy={center}
          r="6"
          fill={currentHand.second}
          style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))' }}
        />

        <ellipse
          cx={center - 40}
          cy={center - 60}
          rx="80"
          ry="50"
          fill="url(#glassReflection)"
          style={{ pointerEvents: 'none' }}
        />
      </svg>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center">
        <div
          className={`text-3xl font-mono font-bold tracking-widest ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}
          style={{
            textShadow: darkMode 
              ? '0 2px 8px rgba(0,0,0,0.5)' 
              : '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          {time.toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })}
        </div>
        <div
          className={`text-sm mt-2 font-medium ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          {time.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
          })}
        </div>
      </div>
    </div>
  )
}

export default Clock
