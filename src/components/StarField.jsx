import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as random from 'maath/random/dist/maath-random.esm'

function Stars(props) {
    const ref = useRef()
    const [sphere] = useState(() => {
        const positions = new Float32Array(5000);
        return random.inSphere(positions, { radius: 1.5 });
    });

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 10
            ref.current.rotation.y -= delta / 15
        }
    })

    if (!sphere || sphere.some(v => isNaN(v))) {
        return null;
    }

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
                <PointMaterial
                    transparent
                    color="#ffffff"
                    size={0.002}
                    sizeAttenuation={true}
                    depthWrite={false}
                />
            </Points>
        </group>
    )
}

export default function StarField() {
    return (
        <div className="absolute inset-0 z-0 bg-near-black pointer-events-none">
            <Canvas camera={{ position: [0, 0, 1] }}>
                <Stars />
            </Canvas>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-near-black/50" />
        </div>
    )
}
