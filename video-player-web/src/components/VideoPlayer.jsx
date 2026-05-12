import { useState, useRef, useEffect, useCallback } from 'react'
import './VideoPlayer.css'

const VideoPlayer = () => {
  const videoRef = useRef(null)
  const containerRef = useRef(null)
  const progressRef = useRef(null)
  const [videoSrc, setVideoSrc] = useState(null)
  const [videoName, setVideoName] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [brightness, setBrightness] = useState(100)
  const [contrast, setContrast] = useState(100)
  const [showControls, setShowControls] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState(null)
  const [videoKey, setVideoKey] = useState(0)
  const controlsTimeoutRef = useRef(null)
  const currentBlobUrlRef = useRef(null)

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (currentBlobUrlRef.current) {
        URL.revokeObjectURL(currentBlobUrlRef.current)
      }
      const url = URL.createObjectURL(file)
      currentBlobUrlRef.current = url
      setError(null)
      setVideoSrc(url)
      setVideoName(file.name)
      setIsPlaying(false)
      setCurrentTime(0)
      setDuration(0)
      setVideoKey(prev => prev + 1)
    }
  }

  const handleVideoError = (e) => {
    console.error('视频加载错误:', e)
    setError('视频加载失败，请尝试其他视频文件')
  }

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current && !isDragging) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const handleProgressClick = (e) => {
    if (progressRef.current && videoRef.current) {
      const rect = progressRef.current.getBoundingClientRect()
      const pos = (e.clientX - rect.left) / rect.width
      videoRef.current.currentTime = pos * duration
    }
  }

  const handleProgressMouseDown = (e) => {
    setIsDragging(true)
    handleProgressClick(e)
  }

  const handleProgressMouseMove = (e) => {
    if (isDragging) {
      handleProgressClick(e)
    }
  }

  const handleProgressMouseUp = () => {
    setIsDragging(false)
  }

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
    }
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !isMuted
      videoRef.current.muted = newMuted
      setIsMuted(newMuted)
    }
  }

  const handlePlaybackRateChange = (rate) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate
      setPlaybackRate(rate)
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const togglePictureInPicture = async () => {
    if (videoRef.current) {
      try {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture()
        } else {
          await videoRef.current.requestPictureInPicture()
        }
      } catch (error) {
        console.error('画中画模式错误:', error)
      }
    }
  }

  const handleMouseMove = useCallback(() => {
    setShowControls(true)
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying && !isDragging) {
        setShowControls(false)
      }
    }, 3000)
  }, [isPlaying, isDragging])

  const skip = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + seconds))
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case ' ':
          e.preventDefault()
          togglePlay()
          break
        case 'ArrowLeft':
          skip(-10)
          break
        case 'ArrowRight':
          skip(10)
          break
        case 'ArrowUp':
          e.preventDefault()
          setVolume(v => Math.min(1, v + 0.1))
          break
        case 'ArrowDown':
          e.preventDefault()
          setVolume(v => Math.max(0, v - 0.1))
          break
        case 'f':
          toggleFullscreen()
          break
        case 'm':
          toggleMute()
          break
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isPlaying, volume])

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume
    }
  }, [volume])

  useEffect(() => {
    return () => {
      if (currentBlobUrlRef.current) {
        URL.revokeObjectURL(currentBlobUrlRef.current)
      }
    }
  }, [])

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0

  return (
    <div className="video-player-wrapper">
      <h1 className="title">🎬 网页视频播放器</h1>
      
      <div className="upload-section">
        <label className="upload-label">
          <input
            type="file"
            accept="video/*"
            onChange={handleFileUpload}
            className="upload-input"
          />
          <span className="upload-button">📁 选择视频文件</span>
        </label>
        {videoName && <p className="video-name">当前播放: {videoName}</p>}
        {error && <p className="error-message">❌ {error}</p>}
      </div>

      {videoSrc ? (
        <div
          ref={containerRef}
          className="video-container"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => isPlaying && !isDragging && setShowControls(false)}
          onMouseUp={handleProgressMouseUp}
        >
          <video
            key={videoKey}
            ref={videoRef}
            src={videoSrc}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
            onClick={togglePlay}
            onError={handleVideoError}
            preload="metadata"
            style={{
              filter: `brightness(${brightness}%) contrast(${contrast}%)`
            }}
            className="video-element"
          />

          {!isPlaying && (
            <div className="play-overlay" onClick={togglePlay}>
              <div className="play-button-large">▶</div>
            </div>
          )}

          <div className={`controls ${showControls ? 'visible' : ''}`}>
            <div
              ref={progressRef}
              className="progress-bar"
              onMouseDown={handleProgressMouseDown}
              onMouseMove={handleProgressMouseMove}
            >
              <div className="progress-bg">
                <div className="progress-fill" style={{ width: `${progressPercentage}%` }}>
                  <div className="progress-thumb"></div>
                </div>
              </div>
            </div>

            <div className="controls-row">
              <div className="left-controls">
                <button className="control-btn" onClick={togglePlay}>
                  {isPlaying ? '⏸' : '▶'}
                </button>
                
                <button className="control-btn" onClick={() => skip(-10)}>
                  ⏪
                </button>
                
                <button className="control-btn" onClick={() => skip(10)}>
                  ⏩
                </button>

                <div className="volume-control">
                  <button className="control-btn" onClick={toggleMute}>
                    {isMuted || volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="volume-slider"
                  />
                </div>

                <span className="time-display">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="right-controls">
                <div className="speed-control">
                  <select
                    value={playbackRate}
                    onChange={(e) => handlePlaybackRateChange(parseFloat(e.target.value))}
                    className="speed-select"
                  >
                    <option value="0.25">0.25x</option>
                    <option value="0.5">0.5x</option>
                    <option value="0.75">0.75x</option>
                    <option value="1">1x</option>
                    <option value="1.25">1.25x</option>
                    <option value="1.5">1.5x</option>
                    <option value="2">2x</option>
                  </select>
                </div>

                <div className="filter-control">
                  <div className="filter-item">
                    <span>☀️</span>
                    <input
                      type="range"
                      min="50"
                      max="150"
                      value={brightness}
                      onChange={(e) => setBrightness(parseInt(e.target.value))}
                      className="filter-slider"
                      title="亮度"
                    />
                    <span className="filter-value">{brightness}%</span>
                  </div>
                  <div className="filter-item">
                    <span>◐</span>
                    <input
                      type="range"
                      min="50"
                      max="150"
                      value={contrast}
                      onChange={(e) => setContrast(parseInt(e.target.value))}
                      className="filter-slider"
                      title="对比度"
                    />
                    <span className="filter-value">{contrast}%</span>
                  </div>
                </div>

                <button className="control-btn" onClick={togglePictureInPicture} title="画中画">
                  📺
                </button>

                <button className="control-btn" onClick={toggleFullscreen}>
                  {isFullscreen ? '⛶' : '⛶'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="no-video">
          <div className="no-video-icon">🎥</div>
          <p>请选择一个视频文件开始播放</p>
          <p className="hint">支持 MP4, WebM, OGG 等格式</p>
        </div>
      )}

      <div className="keyboard-shortcuts">
        <h3>⌨️ 快捷键说明</h3>
        <div className="shortcuts-grid">
          <span><kbd>空格</kbd> 播放/暂停</span>
          <span><kbd>←</kbd> 后退10秒</span>
          <span><kbd>→</kbd> 前进10秒</span>
          <span><kbd>↑</kbd> 增加音量</span>
          <span><kbd>↓</kbd> 降低音量</span>
          <span><kbd>M</kbd> 静音</span>
          <span><kbd>F</kbd> 全屏</span>
        </div>
      </div>
    </div>
  )
}

export default VideoPlayer
