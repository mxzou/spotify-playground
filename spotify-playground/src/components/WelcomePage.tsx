import { motion } from 'framer-motion'

export function WelcomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black p-4">
      <div className="max-w-md w-full space-y-8 p-8 bg-gray-800/30 backdrop-blur rounded-2xl">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold text-white">
            Playlist Sculptor
          </h1>
          <p className="text-gray-300">
            Shape your music in 3D space
          </p>
        </div>

        <button
          onClick={() => window.location.href = '/auth/login'}
          className="w-full py-3 px-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
        >
          Connect with Spotify
        </button>
      </div>
    </div>
  )
} 