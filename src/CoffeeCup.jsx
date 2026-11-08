import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

function CoffeeCup() {
    const cupRef = useRef();

    useFrame((state, delta) => {
        cupRef.current.rotation.y += delta * 0.3;
    });

    return (
        <group ref={cupRef}>
            {/* Корпус чашки */}
            <mesh>
                <cylinderGeometry args={[1, 0.8, 1.6, 64]} />
                <meshStandardMaterial
                    color="#fff8ef"
                    roughness={0.25}
                    metalness={0}
                />
            </mesh>

            {/* Поверхня кави */}
            <mesh position={[0, 0.81, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[0.9, 64]} />
                <meshStandardMaterial color="#392014" roughness={0.35} />
            </mesh>

            {/* Ручка */}
            <mesh position={[1.05, 0, 0]}>
                <torusGeometry args={[0.5, 0.13, 16, 48]} />
                <meshStandardMaterial
                    color="#fff8ef"
                    roughness={0.25}
                    metalness={0}
                />
            </mesh>
        </group>
    );
}

export default CoffeeCup;