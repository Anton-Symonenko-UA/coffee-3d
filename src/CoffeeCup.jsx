import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Center, Resize, useGLTF } from "@react-three/drei";

function CoffeeCup({ cupColor, isRotating, scrollTurn }) {
  const cupRef = useRef();
  const autoRotation = useRef(0);
  const { scene } = useGLTF("/models/coffeecup.glb");

  const model = useMemo(() => {
    const copy = scene.clone(true);

    copy.traverse((object) => {
      if (!object.isMesh) return;

      const prepareMaterial = (original) => {
        const material = original.clone();

        if (material.name === "Coffee") {
          material.transmission = 0;
          material.roughness = 0.2;
        }

        return material;
      };

      object.material = Array.isArray(object.material)
        ? object.material.map(prepareMaterial)
        : prepareMaterial(object.material);
    });

    return copy;
  }, [scene]);

  useEffect(() => {
    model.traverse((object) => {
      if (!object.isMesh) return;

      const materials = Array.isArray(object.material)
        ? object.material
        : [object.material];

      materials.forEach((material) => {
        if (material.name === "Ceramic") {
          material.color.set(cupColor);
        }
      });
    });
  }, [model, cupColor]);

  useEffect(() => {
    return () => {
      model.traverse((object) => {
        if (!object.isMesh) return;

        const materials = Array.isArray(object.material)
          ? object.material
          : [object.material];

        materials.forEach((material) => material.dispose());
      });
    };
  }, [model]);

  useFrame((_, delta) => {
    if (!cupRef.current) return;

    if (isRotating) {
      autoRotation.current += delta * 0.3;
    }

    cupRef.current.rotation.y = autoRotation.current + scrollTurn.current;
  });

  return (
    <group ref={cupRef} position={[0, -0.94, 0]}>
      <Resize scale={3}>
        <Center top>
          <primitive object={model} />
        </Center>
      </Resize>
    </group>
  );
}

export default CoffeeCup;
