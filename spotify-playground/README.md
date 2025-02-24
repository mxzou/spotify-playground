# Spotify Playlist Sculptor

A collaborative 3D environment for creating and managing Spotify playlists.

## Setup

1. **Prerequisites**
   - [Bun](https://bun.sh) installed
   - Spotify Developer account
   - Spotify application credentials

2. **Environment Configuration**
   Create a `.env` file with:
   ```env
   SPOTIFY_CLIENT_ID=your_client_id_here
   SPOTIFY_CLIENT_SECRET=your_client_secret_here
   SPOTIFY_REDIRECT_URI=http://localhost:3000/auth/callback
   SPOTIFY_SCOPE="playlist-modify-public playlist-modify-private user-read-private user-read-email"
   ```

3. **Installation**
   ```bash
   bun install
   ```

4. **Development**
   ```bash
   bun run dev
   ```

## Project Structure
