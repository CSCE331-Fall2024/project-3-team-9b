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
    <div className="fixed top-0 left-0 right-0 bg-white p-4 z-50 shadow-md">
      <label htmlFor="zoom-slider" className="block text-sm font-medium text-gray-700 mb-2">
        Zoom: {zoom}%
      </label>
      <input
        id="zoom-slider"
        type="range"
        min="100"
        max="200"
        value={zoom}
        onChange={handleZoomChange}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
    </div>
  );
};

export default ZoomSlider;