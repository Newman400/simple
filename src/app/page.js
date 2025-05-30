'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CFChallengePage() {
  const [turnstileReady, setTurnstileReady] = useState(false)
  const router = useRouter()

  const rayId = Array(16).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
    script.async = true
    script.defer = true
    script.onload = () => setTurnstileReady(true)
    document.head.appendChild(script)
    return () => document.head.removeChild(script)
  }, [])

  useEffect(() => {
    if (turnstileReady && window.turnstile && document.getElementById('cf-turnstile')) {
      window.turnstile.render('#cf-turnstile', {
        sitekey: '0x4AAAAAABehpPA74WTKx33D',
        callback: async (token) => {
          try {
            const res = await fetch('/api/turnstile', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token }),
            })

            if (res.ok) {
              setTimeout(() => {
                router.push('/loading')
              }, 2500)
            } else {
              alert('Verification failed.')
              window.turnstile.reset()
            }
          } catch (e) {
            alert('Network error.')
            window.turnstile.reset()
          }
        },
        theme: 'light'
      })
    }
  }, [turnstileReady])

  return (
    <html lang="en-US">
      <head>
        <title>Just a moment...</title>
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=Edge" />
        <meta name="robots" content="noindex,nofollow" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <style>{`
          *{box-sizing:border-box;margin:0;padding:0}
          html{line-height:1.15;-webkit-text-size-adjust:100%;color:#313131;
            font-family:system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,
            Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,
            Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji}
          body{display:flex;flex-direction:column;height:100vh;min-height:100vh}
          .main-content{margin:8rem auto;max-width:60rem;padding-left:1.5rem;padding-right:1.5rem;text-align:center}
          .h2{font-size:1.5rem;font-weight:500;line-height:2.25rem;margin-bottom:1rem}
          .desc{color:#6c6c6c;font-size:.9rem}
          @media (width <= 720px){
            .main-content{margin-top:4rem}
            .h2{font-size:1.25rem;line-height:1.5rem}
          }
          @media (prefers-color-scheme:dark){
            body{background-color:#222;color:#d9d9d9}
          }
          .footer{font-size:0.75rem;color:#aaa;margin-top:2rem}
        `}</style>
      </head>
      <body>
        <main className="main-content">
          <noscript>
            <div className="h2">
              <span id="challenge-error-text">Enable JavaScript and cookies to continue</span>
            </div>
          </noscript>
          <div className="h2">Just a moment...</div>
          <p className="desc">Checking if the site connection is secure</p>

          <div style={{ marginTop: '2rem' }}>
            <div id="cf-turnstile" style={{ display: 'inline-block' }} />
          </div>

          <div className="footer">
            <p>Performance &amp; security by Cloudflare</p>
            <p>Ray ID: {rayId}</p>
          </div>
        </main>
      </body>
    </html>
  )
}
