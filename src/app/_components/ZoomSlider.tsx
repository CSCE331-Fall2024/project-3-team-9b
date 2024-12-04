import React, { useState, useEffect } from 'react';

const ZoomSlider: React.FC = () => {
  const [zoom, setZoom] = useState(100);

  useEffect(() => {
    document.body.style.zoom = `${zoom}%`;
    return () => {
      document.body.style.zoom = '100%';
    };
  }, [zoom]);

  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZoom(Number(e.target.value));
  };

  return (
    <div className="absolute top-20 middle-2 z-50 flex items-center bg-transparent">
      <input
        type="range"
        min="100"
        max="200"
        value={zoom}
        onChange={handleZoomChange}
        className="w-24 h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer"
      />
      <span className="ml-2 text-xs text-white-600">{zoom}%</span>
    </div>
  );
};

export default ZoomSlider;