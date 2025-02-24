import { Context } from 'hono'
import { getCookie, setCookie } from 'hono/cookie'

/**
 * Spotify Authentication URLs
 * @see https://developer.spotify.com/documentation/web-api/tutorials/code-flow
 */
const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize'
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token'

/**
 * Handles Spotify OAuth2 authentication flow
 * 
 * This class manages:
 * 1. Initial OAuth login redirect
 * 2. Callback handling and token acquisition
 * 3. Token refresh mechanism
 * 
 * Security measures:
 * - Uses state parameter to prevent CSRF
 * - Stores tokens in HTTP-only secure cookies
 * - Implements token refresh
 */
export class AuthHandler {
  constructor(
    private clientId: string,      // Your Spotify application client ID
    private clientSecret: string,  // Your Spotify application client secret
    private redirectUri: string,   // Must match the one registered in Spotify Dashboard
    private scope: string         // Space-separated list of Spotify permission scopes
  ) {}

  /**
   * Initiates the Spotify OAuth2 login flow
   * 
   * 1. Generates a random state for CSRF protection
   * 2. Stores state in a secure cookie
   * 3. Redirects to Spotify authorization page
   * 
   * @param c - Hono Context
   * @returns Redirect to Spotify login
   */
  async login(c: Context) {
    const state = Math.random().toString(36).substring(7)
    setCookie(c, 'spotify_auth_state', state, { httpOnly: true })

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      scope: this.scope,
      redirect_uri: this.redirectUri,
      state: state
    })

    return c.redirect(`${SPOTIFY_AUTH_URL}?${params.toString()}`)
  }

  /**
   * Handles the OAuth2 callback from Spotify
   * 
   * Flow:
   * 1. Validates state parameter against stored state
   * 2. Exchanges authorization code for access/refresh tokens
   * 3. Stores tokens in secure cookies
   * 
   * @param c - Hono Context
   * @returns Redirect to home page or error response
   */
  async callback(c: Context) {
    const code = c.req.query('code')
    const state = c.req.query('state')
    const storedState = getCookie(c, 'spotify_auth_state')

    // Verify state to prevent CSRF attacks
    if (!state || state !== storedState) {
      return c.json({ error: 'State mismatch' }, 403)
    }

    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code!,
      redirect_uri: this.redirectUri
    })

    // Exchange code for tokens
    const response = await fetch(SPOTIFY_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${this.clientId}:${this.clientSecret}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params
    })

    const data = await response.json()
    
    if (!response.ok) {
      return c.json({ error: 'Failed to get access token' }, 400)
    }

    // Store tokens in secure HTTP-only cookies
    setCookie(c, 'spotify_access_token', data.access_token, { 
      httpOnly: true, 
      secure: true,
      maxAge: data.expires_in 
    })
    
    if (data.refresh_token) {
      setCookie(c, 'spotify_refresh_token', data.refresh_token, { 
        httpOnly: true, 
        secure: true 
      })
    }

    return c.redirect('/')
  }

  /**
   * Refreshes an expired access token using the refresh token
   * 
   * @param c - Hono Context
   * @returns Success response or error if refresh fails
   * 
   * Common issues:
   * - Missing refresh token
   * - Invalid/expired refresh token
   * - Network errors
   */
  async refresh(c: Context) {
    const refreshToken = getCookie(c, 'spotify_refresh_token')
    
    if (!refreshToken) {
      return c.json({ error: 'No refresh token' }, 401)
    }

    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    })

    const response = await fetch(SPOTIFY_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params
    })

    const data = await response.json()
    
    if (!response.ok) {
      return c.json({ error: 'Failed to refresh token' }, 400)
    }

    setCookie(c, 'spotify_access_token', data.access_token, { 
      httpOnly: true, 
      secure: true,
      maxAge: data.expires_in 
    })

    return c.json({ success: true })
  }
}

// Add debug logging
console.log('AuthHandler methods:', Object.getOwnPropertyNames(AuthHandler.prototype)) 