export async function POST(request) {
  try {
    const { token } = await request.json()
    if (!token) {
      return Response.json({ error: 'Token required' }, { status: 400 })
    }

    const verify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: token
      })
    })

    const result = await verify.json()

    if (result.success) {
      return Response.json({ success: true })
    } else {
      return Response.json({ error: 'Verification failed' }, { status: 400 })
    }
  } catch (err) {
    console.error(err)
    return Response.json({ error: 'Internal error' }, { status: 500 })
  }
}