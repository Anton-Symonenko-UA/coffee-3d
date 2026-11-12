import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { store, prefersReducedMotion } from "../store";

// Кавове зерно з деформованої сфери: витягуємо, сплющуємо і продавлюємо борозенку.
function createBeanGeometry() {
  const geometry = new THREE.SphereGeometry(1, 40, 28);
  const position = geometry.attributes.position;
  const v = new THREE.Vector3();

  for (let i = 0; i < position.count; i++) {
    v.fromBufferAttribute(position, i);
    const groove = Math.exp(-(v.x * v.x) / 0.018) * Math.max(0, v.y) * 0.45;
    v.y -= groove;
    v.set(v.x * 0.66, v.y * 0.46, v.z * 0.92);
    position.setXYZ(i, v.x, v.y, v.z);
  }

  geometry.computeVertexNormals();
  return geometry;
}

// Детермінований «рандом», щоб зерна завжди були на тих самих місцях
function seeded(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const BEAN_COUNT = 16;

function Beans({ intro }) {
  const group = useRef();
  const meshes = useRef([]);
  const reduced = useMemo(() => prefersReducedMotion(), []);

  const geometry = useMemo(() => createBeanGeometry(), []);
  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#3a2014",
        roughness: 0.42,
        clearcoat: 0.7,
        clearcoatRoughness: 0.35,
        sheen: 0.4,
        sheenColor: new THREE.Color("#8a5a3a"),
      }),
    []
  );

  const beans = useMemo(() => {
    const random = seeded(42);
    return Array.from({ length: BEAN_COUNT }, (_, i) => {
      const angle = (i / BEAN_COUNT) * Math.PI * 2 + random() * 0.4;
      const radius = 2.1 + random() * 1.1;
      return {
        position: new THREE.Vector3(
          Math.cos(angle) * radius,
          -0.1 + random() * 2.6,
          Math.sin(angle) * radius * 0.8
        ),
        rotation: new THREE.Euler(random() * 6, random() * 6, random() * 6),
        spin: new THREE.Vector3(random() - 0.5, random() - 0.5, random() - 0.5).multiplyScalar(0.8),
        scale: 0.1 + random() * 0.07,
        phase: random() * Math.PI * 2,
        delay: random() * 0.45,
      };
    });
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const d = Math.min(delta, 0.05);
    if (group.current && !reduced) {
      group.current.rotation.y += d * 0.06;
      // Легкий паралакс від миші
      group.current.position.x = THREE.MathUtils.damp(group.current.position.x, store.pointer.x * 0.25, 2, d);
    }

    meshes.current.forEach((mesh, i) => {
      if (!mesh) return;
      const bean = beans[i];
      const appear = THREE.MathUtils.clamp((intro.current - bean.delay) / 0.5, 0, 1);
      const pop = 1 - Math.pow(1 - appear, 3);
      mesh.scale.setScalar(bean.scale * pop);
      mesh.position.y = bean.position.y + (reduced ? 0 : Math.sin(t * 0.8 + bean.phase) * 0.12);
      if (!reduced) {
        mesh.rotation.x += bean.spin.x * d;
        mesh.rotation.y += bean.spin.y * d;
        mesh.rotation.z += bean.spin.z * d;
      }
    });
  });

  return (
    <group ref={group}>
      {beans.map((bean, i) => (
        <mesh
          key={i}
          ref={(el) => (meshes.current[i] = el)}
          geometry={geometry}
          material={material}
          position={bean.position}
          rotation={bean.rotation}
          scale={0}
        />
      ))}
    </group>
  );
}

export default Beans;
