import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'

const app = new Hono()

// Middleware
app.use('*', logger())
app.use('*', cors())

// Serve static files from public directory
app.use('/assets/*', serveStatic({ root: './public' }))

// API Routes
app.get('/api/health', (c) => c.json({ status: 'ok' }))

// Auth routes
app.get('/auth/login', async (c) => {
  const clientId = process.env.SPOTIFY_CLIENT_ID
  const redirectUri = `${process.env.APP_URL}/auth/callback`
  const scope = 'playlist-read-private playlist-modify-public playlist-modify-private'
  
  const authUrl = new URL('https://accounts.spotify.com/authorize')
  authUrl.searchParams.append('client_id', clientId!)
  authUrl.searchParams.append('response_type', 'code')
  authUrl.searchParams.append('redirect_uri', redirectUri)
  authUrl.searchParams.append('scope', scope)

  return c.redirect(authUrl.toString())
})

// Serve index.html for all other routes to support client-side routing
app.get('*', async (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Spotify Playlist Sculptor</title>
        <link rel="stylesheet" href="/assets/styles.css">
      </head>
      <body>
        <div id="root"></div>
        <script type="module" src="/assets/client.js"></script>
      </body>
    </html>
  `)
})

// Start the server
export default app 