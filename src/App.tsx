import React, { useState, useRef } from 'react';
import Canvas from './Canvas';
import './App.css';

const App: React.FC = () => {
  const [clearCanvas, setClearCanvas] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleCanvasCleared = () => {
    setClearCanvas(false);
  };

  const handleSend = async () => {
    if (canvasRef.current) {
      const base64Image = canvasRef.current.toDataURL('image/png');
      
      try {
        const response = await fetch('http://localhost:11434/api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(
              {
                "model": "llava",
                "prompt":"What is in this picture? Please answer with just one word!",
                "stream": false,
                "images": [base64Image.split(',')[1]]
              }
          ),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.text();
        const sanitizedData = data.replace(/\s/g, '');
        const res = JSON.parse(`[${sanitizedData.trim()}]`);
        console.log(base64Image.split(',')[1]);
        console.log(res[0].response);
      } catch (error) {
        console.error('Error sending request:', error);
      }
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
