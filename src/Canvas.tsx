import React, { useRef, useEffect, useState, useCallback, forwardRef } from 'react';

interface CanvasProps {
  clearCanvas: boolean;
  onCanvasCleared: () => void;
  onCanvasUpdated: (dataUrl: string) => void;
}

const Canvas = forwardRef<HTMLCanvasElement, CanvasProps>(({ clearCanvas, onCanvasCleared, onCanvasUpdated }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Forward the ref
  useEffect(() => {
    if (ref) {
      if (typeof ref === 'function') {
        ref(canvasRef.current);
      } else {
        ref.current = canvasRef.current;
      }
    }
  }, [ref]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.strokeStyle = 'black';
    context.lineWidth = 2;
    context.lineCap = 'round';
  }, []);

  const resizeAndGetDataUrl = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizedCanvas = document.createElement('canvas');
    resizedCanvas.width = 100;
    resizedCanvas.height = 100;
    const resizedContext = resizedCanvas.getContext('2d');

    if (resizedContext) {
      resizedContext.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, 100, 100);
      const dataUrl = resizedCanvas.toDataURL('image/png');
      onCanvasUpdated(dataUrl);
    }
  }, [onCanvasUpdated]);

  useEffect(() => {
    resizeAndGetDataUrl();
  }, [resizeAndGetDataUrl]);

  const clearCanvasContent = useCallback(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (canvas && context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  useEffect(() => {
    if (clearCanvas) {
      clearCanvasContent();
      onCanvasCleared();
    }
  }, [clearCanvas, clearCanvasContent, onCanvasCleared]);

  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const point = getEventPoint(event);
    setLastPoint(point);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setLastPoint(null);
  };

  const draw = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPoint) return;

    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    const currentPoint = getEventPoint(event);

    context.beginPath();
    context.moveTo(lastPoint.x, lastPoint.y);
    context.lineTo(currentPoint.x, currentPoint.y);
    context.stroke();

    setLastPoint(currentPoint);
    resizeAndGetDataUrl();
  };

  const getEventPoint = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in event ? event.touches[0].clientX : event.clientX) - rect.left;
    const y = ('touches' in event ? event.touches[0].clientY : event.clientY) - rect.top;
    return { x, y };
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
})

export default Canvas;
