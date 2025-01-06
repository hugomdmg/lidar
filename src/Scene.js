import React, { useRef, useEffect, useState } from 'react';
import { OrbitControls } from '@react-three/drei';
import Movements from './movements';

const Scene = ({ viewSimulation, coordinates, setLoading }) => {
    const pointCloudRef = useRef(null);
    const orbitControlsRef = useRef(null);
    const fallingBufferRef = useRef(null);

    const movements = new Movements()

    const [frame, setFrame] = useState(0);
    const [ready, setReady] = useState(false);
    const [simulation, setSimulation] = useState([]);
    const [fallingPoints, setFallingPoints] = useState(
        Array.from({ length: 5 }, () => ({
            x: Math.random(),
            y: Math.random() + 1,
            z: Math.random(),
            vx: 0,
            vy: 0,
            vz: 0
        }))
    );

    const doSimulation = () => {
        setLoading(true)
        const simulationData = [fallingPoints];
        if (coordinates.length > 0) {
            for (let i = 0; i < 60; i++) {
                const previousPoints = simulationData[simulationData.length - 1].map(point => ({ ...point }));
                const calculated = movements.calculate(previousPoints, coordinates);
                simulationData.push(calculated.map(point => ({ ...point })));
            }
        }
        setSimulation(simulationData);
        setReady(true);
        setLoading(false)
    };

    useEffect(() => {
        if (viewSimulation && !ready) {
            doSimulation();
        }
    }, [viewSimulation, ready]);

    useEffect(() => {
        if (viewSimulation && simulation.length > 0) {
            const intervalId = setInterval(() => {
                setFrame(prevFrame => {
                    if (prevFrame < simulation.length - 1) {
                        return prevFrame + 1;
                    } else {
                        clearInterval(intervalId);
                        return prevFrame;
                    }
                });
            }, 60);

            return () => clearInterval(intervalId);
        }
    }, [viewSimulation, simulation]);

    useEffect(() => {
        if (fallingBufferRef.current && simulation.length > 0) {
            const positions = fallingBufferRef.current.array;

            simulation[frame].forEach((point, index) => {
                positions[index * 3] = point.x;
                positions[index * 3 + 1] = point.y;
                positions[index * 3 + 2] = point.z;
            });

            fallingBufferRef.current.needsUpdate = true;
        }
    }, [frame, simulation]);

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
                <pointsMaterial color={'#61dafb'} size={0.01} />
            </points>

            {simulation.length > 0 && (
                <points castShadow receiveShadow>
                    <bufferGeometry>
                        <bufferAttribute
                            ref={fallingBufferRef}
                            attach="attributes-position"
                            array={new Float32Array(
                                simulation[0].flatMap(() => [0, 0, 0])
                            )}
                            count={fallingPoints.length}
                            itemSize={1}
                        />
                    </bufferGeometry>
                    <pointsMaterial color={'#ff6347'} size={0.1} />
                </points>
            )}
        </>
    );
};

export default Scene;
