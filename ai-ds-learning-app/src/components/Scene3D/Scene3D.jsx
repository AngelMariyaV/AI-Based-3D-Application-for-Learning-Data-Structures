import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { Suspense } from "react";

function Scene3D({
  children,
  cameraPosition = [6, 6, 9],
  height = "26rem",
  background = "linear-gradient(180deg,#eef2ff 0%,#e0e7ff 100%)",
}) {
  return (
    <div
      style={{ height, background }}
      className="w-full rounded-2xl overflow-hidden border border-indigo-100 shadow-inner"
    >
      <Canvas camera={{ position: cameraPosition, fov: 45 }} shadows>
        <Suspense fallback={null}>
          <ambientLight intensity={0.7} />
          <directionalLight
            position={[8, 10, 5]}
            intensity={1.1}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <pointLight position={[-8, 6, -5]} intensity={0.3} color="#818cf8" />
          <Environment preset="city" />
          <gridHelper args={[30, 30, "#c7d2fe", "#e0e7ff"]} position={[0, -0.51, 0]} />
          {children}
          <OrbitControls
            enablePan={false}
            minDistance={4}
            maxDistance={20}
            maxPolarAngle={Math.PI / 2.05}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default Scene3D;
