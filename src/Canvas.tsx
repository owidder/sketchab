import React, { useRef, useEffect, useState } from 'react';

const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const context = canvas.getContext('2d');
    if (!context) return;

    context.strokeStyle = 'black';
    context.lineWidth = 2;
    context.lineCap = 'round';

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(event);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const draw = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in event ? event.touches[0].clientX : event.clientX) - rect.left;
    const y = ('touches' in event ? event.touches[0].clientY : event.clientY) - rect.top;

    context.lineTo(x, y);
    context.stroke();
    context.beginPath();
    context.moveTo(x, y);
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseOut={stopDrawing}
      onTouchStart={startDrawing}
      onTouchMove={draw}
      onTouchEnd={stopDrawing}
      style={{ display: 'block', width: '100%', height: '100%' }}
    />
  );
};

export default Canvas;
