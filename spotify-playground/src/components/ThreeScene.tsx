import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

export function ThreeScene() {
  return (
    <div className="fixed inset-0">
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <mesh>
          <boxGeometry />
          <meshStandardMaterial color="royalblue" />
        </mesh>
        <OrbitControls />
      </Canvas>
    </div>
  )
} 