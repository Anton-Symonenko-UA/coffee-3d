import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard } from "@react-three/drei";
import * as THREE from "three";
import { store } from "../store";

// Пара — це прозора площина з шейдером: шум (fbm) рухається вгору,
// а маски по краях роблять форму «струменя».
const vertexShader = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 p = position;
    // Легке звивання догори
    p.x += sin(uv.y * 4.0 - uTime * 0.8) * 0.14 * uv.y;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uOpacity;
  uniform float uSeed;
  varying vec2 vUv;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p *= 2.03;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    vec2 q = vec2(uv.x * 2.4 + uSeed, uv.y * 1.7 - uTime * 0.22);
    float n = fbm(q + fbm(q * 1.4 + uTime * 0.06));

    float alpha = smoothstep(0.4, 0.8, n);
    // Вертикальна маска: з'являється над кавою, розчиняється вгорі
    alpha *= smoothstep(0.1, 0.4, uv.y) * (1.0 - smoothstep(0.4, 1.0, uv.y));
    // Горизонтальна маска: вузько внизу, ширше вгорі
    float width = mix(0.16, 0.48, uv.y);
    alpha *= 1.0 - smoothstep(width * 0.55, width, abs(uv.x - 0.5));

    gl_FragColor = vec4(vec3(1.0, 0.96, 0.9), alpha * uOpacity);
  }
`;

function SteamPlane({ seed, offset, scale }) {
  const material = useRef();
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uOpacity: { value: 0 }, uSeed: { value: seed } }),
    [seed]
  );

  useFrame((state) => {
    // Оновлюємо уніформи саме того матеріалу, що рендериться
    const u = material.current?.uniforms;
    if (!u) return;
    u.uTime.value = state.clock.elapsedTime + seed * 10;
    u.uOpacity.value = store.steamOpacity * 0.42;
  });

  return (
    <mesh position={offset} scale={scale}>
      <planeGeometry args={[1, 1, 1, 32]} />
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function Steam({ baseY }) {
  return (
    <Billboard position={[0, baseY, 0]}>
      <SteamPlane seed={0.0} offset={[0, 0.95, 0]} scale={[1.0, 2.0, 1]} />
      <SteamPlane seed={3.7} offset={[0.1, 1.1, -0.05]} scale={[0.85, 2.3, 1]} />
    </Billboard>
  );
}

export default Steam;
