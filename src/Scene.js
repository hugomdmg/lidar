import React, { useRef, useEffect } from 'react';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';


const Scene = ({ coordinates }) => {
    const pointCloudRef = useRef(null);
    const geometryRef = useRef(null);
    const orbitControlsRef = useRef(null);

    useEffect(() => {
        if (geometryRef.current && coordinates.length > 0) {
            const positions = new Float32Array(
                coordinates.flatMap((coord) => [coord.x, coord.y, coord.z])
            );
            geometryRef.current.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometryRef.current.attributes.position.needsUpdate = true;
        }
    }, [coordinates]);

    return (
        <>
            <ambientLight intensity={0.1} />
            <pointLight
                position={[10, 10, 10]}
                castShadow
                intensity={1}
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
            />

            <OrbitControls ref={orbitControlsRef} maxDistance={200} minDistance={0.5} />

            <points ref={pointCloudRef} castShadow receiveShadow>
                <bufferGeometry ref={geometryRef}>
                </bufferGeometry>
                <pointsMaterial color={'#61dafb'} size={0.01} />
            </points>
        </>
    );
};

export default Scene;

