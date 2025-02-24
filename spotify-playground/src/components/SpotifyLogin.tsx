import React from "react"

export function SpotifyLogin() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <main className="flex-1">
        <div className="container flex flex-col items-center justify-center min-h-screen px-4 py-12">
          <div className="flex flex-col items-center space-y-8 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Welcome to Spotify Playlist Sculptor
              </h1>
              <p className="mx-auto max-w-[600px] text-gray-400 md:text-xl/relaxed">
                Create and manage your playlists in an immersive 3D environment.
              </p>
            </div>
            <div className="space-y-4">
              <button
                onClick={() => window.location.href = '/auth/login'}
                className="inline-flex h-10 items-center justify-center rounded-md bg-[#1DB954] px-8 text-sm font-medium text-white transition-colors hover:bg-[#1DB954]/90"
              >
                Login with Spotify
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 