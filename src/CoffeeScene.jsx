import { Canvas } from "@react-three/fiber";
import {
  Environment,
  Lightformer,
  ContactShadows,
  OrbitControls,
} from "@react-three/drei";
import CoffeeCup from "./CoffeeCup";
import { Suspense, useEffect, useRef } from "react";

function CoffeeScene({ cupColor, isRotating }) {
  const sceneRef = useRef(null);
  const scrollTurn = useRef(0);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    function updateTurn() {
      const { top, height } = scene.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, -top / Math.max(height, 1)));

      scrollTurn.current = reducedMotion.matches ? 0 : progress * (Math.PI / 2);
    }

    updateTurn();
    window.addEventListener("scroll", updateTurn, { passive: true });
    window.addEventListener("resize", updateTurn);
    reducedMotion.addEventListener("change", updateTurn);

    return () => {
      window.removeEventListener("scroll", updateTurn);
      window.removeEventListener("resize", updateTurn);
      reducedMotion.removeEventListener("change", updateTurn);
    };
  }, []);
  return (
    <div className="scene" ref={sceneRef}>
      <Canvas camera={{ position: [3, 2, 4], fov: 45 }}>
        <Environment background={false} frames={1} resolution={256}>
          {/* Широкий теплий відблиск на корпусі */}
          <Lightformer
            position={[3, 4, 5]}
            scale={[5, 3]}
            color="#ffe4c4"
            intensity={3}
          />

          {/* Вузький відблиск уздовж краю */}
          <Lightformer
            position={[-3, 2, -4]}
            scale={[1, 4]}
            color="#ffbb80"
            intensity={4}
          />
        </Environment>
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
          <CoffeeCup
            cupColor={cupColor}
            isRotating={isRotating}
            scrollTurn={scrollTurn}
          />
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
