import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import Rig from "./Rig";

// Одна фіксована 3D-сцена на весь сайт. Чашка «подорожує» між секціями під час скролу.
function Experience({ cupColor, isRotating }) {
  return (
    <div className="experience" aria-hidden="true">
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 1.35, 7.5], fov: 35 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        {/* Студійне освітлення через «софтбокси» в оточенні — дає красиві відблиски на глазурі */}
        <Environment frames={1} resolution={256}>
          <Lightformer form="rect" position={[3, 4, 5]} scale={[5, 3]} color="#ffe4c4" intensity={3} />
          <Lightformer form="rect" position={[-4, 2, -3]} scale={[1, 5]} color="#ffb070" intensity={4} />
          <Lightformer form="ring" position={[0, 6, 0]} rotation-x={Math.PI / 2} scale={3} color="#fff3e0" intensity={2} />
          <Lightformer form="rect" position={[-5, 0, 3]} scale={[3, 1]} color="#c9dcff" intensity={0.8} />
        </Environment>

        <ambientLight intensity={0.25} />
        <directionalLight position={[3, 5, 4]} intensity={2.2} color="#fff0db" />
        <directionalLight position={[-4, 2, 1]} intensity={0.6} color="#dce8ff" />
        {/* Контурне світло ззаду — підсвічує край чашки і пару */}
        <directionalLight position={[1, 3, -5]} intensity={2.2} color="#ffb877" />

        <Suspense fallback={null}>
          <Rig cupColor={cupColor} isRotating={isRotating} />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default Experience;
