import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";

function Stars(props) {
    const ref = useRef();
    const [sphere] = useState(() =>
        random.inSphere(new Float32Array(5000), { radius: 1.2 })
    );

    useFrame((state, delta) => {
        ref.current.rotation.x -= delta / 10;
        ref.current.rotation.y -= delta / 15;
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
                <PointMaterial
                    transparent
                    color="#5EEAD4"
                    size={0.002}
                    sizeAttenuation={true}
                    depthWrite={false}
                />
            </Points>
        </group>
    );
}

export default function StarField() {
    return (
        <div className="absolute inset-0 z-0 bg-black">
            <Canvas
                camera={{ position: [0, 0, 1] }}
                style={{ background: '#000000' }}
            >
                <Stars />
            </Canvas>
        </div>
    );
}
