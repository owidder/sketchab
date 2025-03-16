import React, { useState } from 'react';
import Canvas from './Canvas';
import './App.css';

const App: React.FC = () => {
  const [clearCanvas, setClearCanvas] = useState(false);

  const handleClearCanvas = () => {
    setClearCanvas(true);
  };

  const handleCanvasCleared = () => {
    setClearCanvas(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Sketching</h1>
        <button className="clear-button" onClick={handleClearCanvas}>Clear</button>
      </header>
      <Canvas clearCanvas={clearCanvas} onCanvasCleared={handleCanvasCleared} />
    </div>
  );
};

export default App;
