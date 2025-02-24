import { createRoot } from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

function Scene() {
  return (
    <mesh>
      <boxGeometry />
      <meshStandardMaterial color="royalblue" />
    </mesh>
  )
}

function App() {
  return (
    <div className="w-screen h-screen">
      {/* 3D Environment */}
      <div className="fixed inset-0">
        <Canvas>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Scene />
          <OrbitControls />
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div className="relative z-10 p-4">
        <div className="bg-gray-800 bg-opacity-80 rounded-lg p-4">
          <h2 className="text-xl font-bold mb-2">Playlist Controls</h2>
          {/* Add playlist controls here */}
        </div>
      </div>
    </div>
  )
}

createRoot(document.getElementById('app')!).render(<App />) 