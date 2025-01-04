import './App.css';
import Scene from './Scene';
import { Canvas, useFrame } from '@react-three/fiber';
import Papa from 'papaparse';
import React, { useState } from 'react';
import Loading from './Loading';



function App() {
  const [coordinates, setCoordinates] = useState([]);
  const [loading, setLoading] = useState(false)
  const [fallingPoints, setFallingPoints] = useState(
    Array.from({ length: 5 }, () => ({
      x: Math.random(),
      y: Math.random() + 2,
      z: Math.random(),
      vx: 0,
      vy: 0.01,
      vz: 0
    }))
  );
  //-----------------
const [viewSimulation, setViewSimulation] = useState(false)

  //-------------------

  const handleFileUpload = (event) => {
    setLoading(true)
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          let minX = Infinity;
          let minY = Infinity;
          let minZ = Infinity;
          let maxX = -Infinity;
          let maxY = -Infinity;
          let maxZ = -Infinity;

          const parsedData = result.data;

          parsedData.forEach(coord => {
            const z = parseFloat(coord.x);
            const y = parseFloat(coord.value);
            const x = parseFloat(coord.y);

            if (x && y && z) {
              minX = minX > x ? x : minX;
              minY = minY > y ? y : minY;
              minZ = minZ > z ? z : minZ;
              maxX = maxX < x ? x : maxX;
              maxY = maxY < y ? y : maxY;
              maxZ = maxZ < z ? z : maxZ;
            }
          });
          console.log(minX, minY, minZ)

          const parsedCoordinates = []
          parsedData.forEach((row, index) => {
            const z = parseFloat(row.x);
            const y = parseFloat(row.value);
            const x = parseFloat(row.y);

            if (!isNaN(x) && !isNaN(y) && !isNaN(z)) {
              parsedCoordinates.push({
                x: 0.01 * ((x - minX) - (maxX - minX) / 2),
                y: 0.01 * ((y - minY) - (maxY - minY) / 2),
                z: 0.01 * ((z - minZ) - (maxZ - minZ) / 2)
              })
            }
          });

          setCoordinates(parsedCoordinates);
          setLoading(false)
        },
        header: true
      });
    }
  };
  return (
    <div className="App">
      <header className="App-header">
        <input type="file" accept=".csv" onChange={handleFileUpload} />
        {loading && (
          <Loading size={100} />
        )}
        <button onClick={() => {setViewSimulation(!viewSimulation) }}>view simulation</button>
        <Canvas
          camera={{ position: [10, 10, 10] }}
          style={{ width: '100%', height: '100vh' }}
          shadows
        >
          <Scene viewSimulation={viewSimulation} coordinates={coordinates} setLoading={setLoading} fallingPoints={fallingPoints} />
        </Canvas>
      </header>
    </div>
  );
}

export default App;
