import React, { useRef, useEffect, useState } from 'react';
import { OrbitControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import Loading from './Loading';

const Scene = ({ coordinates }) => {
    const pointCloudRef = useRef(null);
    const orbitControlsRef = useRef(null);
    // const fallingBufferRef = useRef(null);

    // Inicializamos los puntos que caen
    // const [fallingPoints, setFallingPoints] = useState(
    //     Array.from({ length: 100 }, () => ({
    //         x: Math.random(),
    //         y: Math.random()+2,
    //         z: Math.random(),
    //         vx:0,
    //         vy:0.01,
    //         vz:0
    //     }))
    // );

    useEffect(() => {
        if (orbitControlsRef.current) {
            orbitControlsRef.current.target.set(0, 0, 0);
        }
    }, []);

    // useFrame(() => {
    //     if (fallingBufferRef.current) {
    //         // Obtenemos la posición del buffer
    //         const positions = fallingBufferRef.current.array;

    //         // Actualizamos las posiciones de los puntos
    //         fallingPoints.forEach((point, index) => {
    //             point.y -= point.vy;

    //             // Si el punto está fuera del límite, lo reiniciamos
    //             if (point.y < -1) {
    //                 point.y = Math.random()+2;
    //                 point.x = Math.random();
    //                 point.z = Math.random();
    //                 point.vy = 0.01;
    //             }

    //             // Actualizamos la posición en el buffer
    //             positions[index * 3] = point.x;
    //             positions[index * 3 + 1] = point.y;
    //             positions[index * 3 + 2] = point.z;
    //         });

    //         // Marcamos el buffer como necesitado de actualización
    //         fallingBufferRef.current.needsUpdate = true;
    //     }
    // });

    return (
        <>
            <ambientLight intensity={0.1} />
            <pointLight
                position={[0, 10, 0]}
                castShadow
                intensity={1}
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
            />

            <OrbitControls ref={orbitControlsRef} maxDistance={200} minDistance={0.5} />

            {/* LIDAR Data Points */}
            <points ref={pointCloudRef} castShadow receiveShadow>
                {coordinates.length > 0 && (
                    <bufferGeometry>
                        <bufferAttribute
                            attach="attributes-position"
                            array={new Float32Array(
                                coordinates.flatMap((coord) => [coord.x, coord.y, coord.z])
                            )}
                            count={coordinates.length}
                            itemSize={3}
                        />
                    </bufferGeometry>
                )}
                <pointsMaterial fog={true} color={'#61dafb'} size={0.01} />
            </points>

            {/* Falling Points */}
            {/* <points castShadow receiveShadow>
                <bufferGeometry>
                    <bufferAttribute
                        ref={fallingBufferRef}
                        attach="attributes-position"
                        array={new Float32Array(
                            fallingPoints.flatMap((point) => [point.x, point.y, point.z])
                        )}
                        count={fallingPoints.length}
                        itemSize={3}
                    />
                </bufferGeometry>
                <pointsMaterial fog={true} color={'#ff6347'} size={0.05} />
            </points> */}
        </>
    );
};

export default Scene;


