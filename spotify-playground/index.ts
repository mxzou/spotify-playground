import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import { logger } from 'hono/logger'
import { html } from 'hono/html'
import { AuthHandler } from './src/handlers/auth'
import { getCookie } from 'hono/cookie'

const app = new Hono()

// Add debug logging
console.log('Available middleware:', Object.keys(app))
console.log('Cookie functions:', { getCookie })

// Add environment variable checks
console.log('Environment Variables Check:', {
  clientId: !!process.env.SPOTIFY_CLIENT_ID,
  clientSecret: !!process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: !!process.env.SPOTIFY_REDIRECT_URI,
  scope: !!process.env.SPOTIFY_SCOPE
})

// Initialize auth handler
const auth = new AuthHandler(
  process.env.SPOTIFY_CLIENT_ID!,
  process.env.SPOTIFY_CLIENT_SECRET!,
  process.env.SPOTIFY_REDIRECT_URI!,
  process.env.SPOTIFY_SCOPE!
)

// Middleware
app.use('*', logger())
app.use('/assets/*', serveStatic({ root: './public' }))

// Add static file serving check
app.use('*', async (c, next) => {
  console.log(`[${c.req.method}] ${c.req.path}`)
  if (c.req.path.startsWith('/assets/')) {
    console.log('Static asset requested:', c.req.path)
  }
  await next()
})

// Add debug middleware
app.use('*', async (c, next) => {
  console.log(`${c.req.method} ${c.req.path}`)
  await next()
})

// Serve the React app
app.get('/', (c) => {
  return c.html(
    html`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Spotify Playlist Sculptor</title>
        <script src="/assets/client.js" type="module" defer></script>
        <link href="/assets/globals.css" rel="stylesheet" />
      </head>
      <body class="bg-black">
        <div id="root"></div>
      </body>
    </html>`
  )
})

// Auth routes
app.get('/auth/login', (c) => auth.login(c))
app.get('/auth/callback', (c) => auth.callback(c))
app.post('/auth/refresh', (c) => auth.refresh(c))

// API Routes
app.get('/api/auth/status', (c) => {
  const token = getCookie(c, 'spotify_access_token')
  return c.json({ authenticated: !!token })
})

export default app