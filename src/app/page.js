import { useState, useRef } from 'react'

export default function LoadingPage() {
  const [isPressed, setIsPressed] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [showRedirect, setShowRedirect] = useState(false)
  const intervalRef = useRef(null)

  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (progress / 100) * circumference

  const startProgress = () => {
    if (isCompleted || showRedirect) return
    setIsPressed(true)
    setProgress(0)

    intervalRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(intervalRef.current)
          setIsCompleted(true)
          setTimeout(() => {
            setShowRedirect(true)
            setTimeout(() => {
              window.location.href = '/verify-email'
            }, 1000)
          }, 800)
          return 100
        }
        return prev + 2
      })
    }, 100)
  }

  const stopProgress = () => {
    if (isCompleted || showRedirect) return
    setIsPressed(false)
    setProgress(0)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center border border-white/20">
        
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-800 mb-2">Initialize Connection</h1>
          <p className="text-gray-600 text-sm">Press and hold the button for 5 seconds</p>
        </div>

        <div className="relative mb-6 flex justify-center">
          <button
            className={`relative w-28 h-28 rounded-full transition-all duration-300 focus:outline-none transform ${
              isCompleted 
                ? 'bg-green-500 shadow-xl shadow-green-200/50 scale-105' 
                : isPressed 
                  ? 'bg-purple-600 shadow-xl shadow-purple-300/50 scale-95' 
                  : 'bg-purple-500 shadow-xl shadow-purple-300/50 hover:bg-purple-600 hover:scale-105'
            }`}
            onMouseDown={startProgress}
            onMouseUp={stopProgress}
            onMouseLeave={stopProgress}
            onTouchStart={startProgress}
            onTouchEnd={stopProgress}
            disabled={isCompleted || showRedirect}
          >
            <div className="text-white font-semibold text-sm">
              {showRedirect ? (
                <div className="flex flex-col items-center">
                  <svg className="w-6 h-6 mb-1 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span className="text-xs">Redirecting...</span>
                </div>
              ) : isCompleted ? (
                <div className="flex flex-col items-center">
                  <svg className="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-xs">Complete!</span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <span className="text-sm font-bold">Hold to</span>
                  <span className="text-sm font-bold">Continue</span>
                </div>
              )}
            </div>
          </button>


          <svg
            className="absolute inset-0 w-28 h-28 -rotate-90 pointer-events-none"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="4"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={isCompleted ? '#10b981' : '#ffffff'}
              strokeWidth="4"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-100 ease-linear drop-shadow-sm"
              style={{
                filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.5))'
              }}
            />
          </svg>
        </div>


        <div className="mb-6">
          {showRedirect ? (
            <div className="text-purple-600">
              <div className="font-semibold">Redirecting to verify-email...</div>
              <div className="text-sm opacity-75 mt-1">Please wait</div>
            </div>
          ) : isCompleted ? (
            <div className="text-green-600">
              <div className="font-semibold">Connection Established!</div>
              <div className="text-sm opacity-75 mt-1">Preparing redirect...</div>
            </div>
          ) : isPressed ? (
            <div className="text-purple-600">
              <div className="font-semibold">Hold steady...</div>
              <div className="text-sm mt-1">{Math.floor(progress / 20)}/5 seconds</div>
            </div>
          ) : (
            <div className="text-gray-600">
              <div className="font-semibold">Ready</div>
              <div className="text-sm opacity-75 mt-1">Press and hold to continue</div>
            </div>
          )}
        </div>


        <div className="flex justify-center space-x-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i < Math.floor(progress / 20) 
                  ? isCompleted 
                    ? 'bg-green-400 shadow-lg shadow-green-200' 
                    : 'bg-purple-400 shadow-lg shadow-purple-200'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
