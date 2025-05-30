'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function LoadingPage() {
  const [isPressed, setIsPressed] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const intervalRef = useRef(null)
  const router = useRouter()

  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (progress / 100) * circumference

  const startProgress = () => {
    if (isCompleted) return
    setIsPressed(true)
    setProgress(0)

    intervalRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(intervalRef.current)
          setIsCompleted(true)
          setTimeout(() => {
            router.push('/verify-email')
          }, 1000)
          return 100
        }
        return prev + 2
      })
    }, 100)
  }

  const stopProgress = () => {
    if (isCompleted) return
    setIsPressed(false)
    setProgress(0)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-12 max-w-md w-full text-center border border-white/50">
        <div className="mb-8">
          <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Security Verification</h1>
          <p className="text-gray-600 text-sm">Hold the button for 5 seconds to continue</p>
        </div>

        <div className="relative mb-8">
          <button
            className={`relative w-24 h-24 rounded-full transition-all duration-200 focus:outline-none ${
              isCompleted 
                ? 'bg-green-500 shadow-lg shadow-green-200 scale-105' 
                : isPressed 
                  ? 'bg-blue-600 shadow-lg shadow-blue-200 scale-95' 
                  : 'bg-blue-500 shadow-lg shadow-blue-200 hover:bg-blue-600 hover:scale-105'
            }`}
            onMouseDown={startProgress}
            onMouseUp={stopProgress}
            onMouseLeave={stopProgress}
            onTouchStart={startProgress}
            onTouchEnd={stopProgress}
            disabled={isCompleted}
          >
            <div className="text-white font-bold text-sm">
              {isCompleted ? (
                <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                'HOLD'
              )}
            </div>
          </button>

          <svg
            className="absolute inset-0 w-24 h-24 -rotate-90 pointer-events-none"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="6"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={isCompleted ? '#10b981' : '#3b82f6'}
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-100 ease-linear drop-shadow-sm"
            />
          </svg>
        </div>

        <div className="space-y-2">
          {isCompleted ? (
            <div className="text-green-600">
              <div className="font-semibold">Verification Complete!</div>
              <div className="text-sm opacity-75">Redirecting...</div>
            </div>
          ) : isPressed ? (
            <div className="text-blue-600">
              <div className="font-semibold">Hold steady...</div>
              <div className="text-sm">{Math.floor(progress / 20)}/5 seconds</div>
            </div>
          ) : (
            <div className="text-gray-600">
              <div className="font-medium">Press and hold</div>
              <div className="text-sm opacity-75">Complete the verification</div>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-center space-x-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i < Math.floor(progress / 20) 
                  ? isCompleted ? 'bg-green-400' : 'bg-blue-400'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
