import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import CoffeeCup from './CoffeeCup';


function CoffeeScene() {
    return (
        <div className="scene">
            <Canvas camera={{ position: [3, 2, 4], fov: 45 }}>
                <ambientLight intensity={0.6} />
                <directionalLight position={[3, 4, 5]} intensity={2} />
                <CoffeeCup/>
                <OrbitControls enablePan={false} enableZoom={false} />
            </Canvas>
        </div>
    );
}

export default CoffeeScene;