import { Canvas } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import CoffeeCup from "./CoffeeCup";
import { Suspense } from "react";

function CoffeeScene({ cupColor, isRotating }) {
  return (
    <div className="scene">
      <Canvas camera={{ position: [3, 2, 4], fov: 45 }}>
        <ambientLight intensity={0.35} />

        {/* Основне тепле світло */}
        <directionalLight
          position={[3, 5, 4]}
          intensity={2.5}
          color="#fff0db"
        />

        {/* Слабше світло з протилежного боку */}
        <directionalLight
          position={[-4, 2, 1]}
          intensity={0.8}
          color="#dce8ff"
        />

        {/* Світло ззаду підкреслює край чашки */}
        <directionalLight
          position={[1, 3, -4]}
          intensity={1.5}
          color="#ffdab0"
        />
        <Suspense fallback={null}>
          <CoffeeCup cupColor={cupColor} isRotating={isRotating} />
        </Suspense>
        <ContactShadows
          position={[0, -0.96, 0]}
          opacity={0.5}
          scale={8}
          blur={2.5}
          far={4}
          color="#000000"
        />
        <OrbitControls enablePan={false} enableZoom={false} />
      </Canvas>
    </div>
  );
}

export default CoffeeScene;
