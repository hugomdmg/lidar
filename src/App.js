import './App.css';
import Scene from './Scene';
import { Canvas } from '@react-three/fiber';
import Papa from 'papaparse';
import React, { useState } from 'react';
import Loading from './Loading';

function App() {
  const [coordinates, setCoordinates] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (event) => {
    setLoading(true);
    const file = event.target.files[0];

    if (file && file.type === "text/csv") {
      processFile(file);
    } else {
      alert('Please upload a valid CSV file.');
      setLoading(false);
    }
  };

  const handleExampleFile = (name) => {
    setLoading(true);
    fetch(name)
      .then((response) => {
        console.log(response)
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then((text) => {
        const file = new Blob([text], { type: 'text/csv' });
        processFile(file);
      })
      .catch((error) => {
        console.error('Error fetching example file:', error);
        setLoading(false);
      });
  };

  const processFile = (file) => {
    let allCoordinates = [];

    Papa.parse(file, {
      header: false,
      skipEmptyLines: true,
      delimiter: ',',
      dynamicTyping: true,
      step: (results) => {
        const [y, x, z] = results.data.map((value) => parseFloat(value));
        if (!isNaN(x) && !isNaN(y) && !isNaN(z)) {
          allCoordinates.push({ x, y, z });
        }
      },
      complete: () => {
        if (allCoordinates.length > 0) {
          setCoordinates(transformData(allCoordinates));
        } else {
          console.warn('No valid data found in the file.');
        }
        setLoading(false);
      },
      error: (error) => {
        console.error('Error parsing file:', error);
        setLoading(false);
      },
    });
  };

  const transformData = (data) => {
    let minX = Infinity;
    let minY = Infinity;
    let minZ = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    let maxZ = -Infinity;

    const parsedCoordinates = [];

    data.forEach((row) => {
      const x = parseFloat(row.x);
      const z = parseFloat(row.z);
      const y = parseFloat(row.y);

      if (!isNaN(x) && !isNaN(y) && !isNaN(z)) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        minZ = Math.min(minZ, z);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
        maxZ = Math.max(maxZ, z);
      }
    });

    data.forEach((row) => {
      const x = parseFloat(row.x);
      const z = parseFloat(row.z);
      const y = parseFloat(row.y);

      if (!isNaN(x) && !isNaN(y) && !isNaN(z)) {
        parsedCoordinates.push({
          x: 0.01 * ((x - minX) - (maxX - minX) / 2),
          z: 0.01 * ((y - minY) - (maxY - minY) / 2),
          y: 0.01 * ((z - minZ) - (maxZ - minZ) / 2),
        });
      }
    });

    return parsedCoordinates;
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="button-group">
          <div>
            <label htmlFor="file-input" className="file-label">Upload File</label>
            <input id="file-input" type="file" accept=".csv" onChange={handleFileUpload} />
          </div>
          <button className="styled-button" onClick={() => handleExampleFile('PNOA_duraton.csv')}>
            Load Example 1
          </button>
          <button className="styled-button" onClick={() => handleExampleFile('PNOA_perdido.csv')}>
            Load Example 2
          </button>
        </div>
        <p className='text'>
          This is a program for visualizing LiDAR data. The input file must be in CSV format, without column headers, and the data should be arranged in the following order: latitude, longitude, and altitude.
        </p>
        {loading && <Loading size={100} />}
        <Canvas
          camera={{ position: [10, 0, 0] }}
          style={{ width: '100%', height: '100vh' }}
        >
          <Scene coordinates={coordinates} />
        </Canvas>
      </header>
    </div>

  );
}

export default App;
