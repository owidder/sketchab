import React, { useState, useRef } from 'react';
import Canvas from './Canvas';
import './App.css';

const App: React.FC = () => {
  const [clearCanvas, setClearCanvas] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleCanvasCleared = () => {
    setClearCanvas(false);
  };

  const handleSend = () => {
    if (canvasRef.current) {
      const base64Image = canvasRef.current.toDataURL('image/png');
      console.log(base64Image);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Sketching</h1>
        <button className="send-button" onClick={handleSend}>Send</button>
      </header>
      <Canvas 
        clearCanvas={clearCanvas} 
        onCanvasCleared={handleCanvasCleared} 
        ref={canvasRef}
      />
    </div>
  );
};

export default App;
