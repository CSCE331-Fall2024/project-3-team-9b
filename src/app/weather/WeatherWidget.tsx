'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function WeatherWidget() {
    const [isVisible, setIsVisible] = useState(false); // State for visibility toggle
    const [weather, setWeather] = useState<{
        temperature: number;
        condition: string;
        icon: string;
    } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const toggleVisibility = () => setIsVisible(!isVisible); // Toggle the widget

    const fetchWeather = async () => {
        try {
            const response = await fetch(`/api/fetchWeather?city=College Station`);
            const data = await response.json();

            if (response.ok) {
                setWeather({
                    temperature: data.temperature,
                    condition: data.condition,
                    icon: data.icon || '/default-weather.png', // Default icon fallback
                });
                setError(null);
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('Failed to fetch weather data.');
        }
    };

    useEffect(() => {
        fetchWeather(); // Fetch weather data on mount
    }, []);

    return (
        <div
            className={`fixed bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 w-64 transition-transform ${
                isVisible ? 'translate-y-0' : 'translate-y-full'
            }`}
            style={{ zIndex: 1000 }}
        >
            {/* Toggle Button */}
            <button
                onClick={toggleVisibility}
                className="absolute top-0 left-0 -translate-x-10 bg-blue-600 text-white px-3 py-2 rounded-r-lg shadow-md"
            >
                {isVisible ? '▼' : '▲'}
            </button>

            {/* Widget Content */}
            {isVisible && (
                <div className="flex flex-col items-center">
                    <h1 className="text-lg font-bold text-blue-700 mb-2">College Station</h1>
                    {error ? (
                        <p className="text-red-600 text-sm">{error}</p>
                    ) : weather ? (
                        <>
                            <Image
                                src={weather.icon}
                                alt="Weather icon"
                                width={50}
                                height={50}
                                className="mb-2"
                            />
                            <p className="text-xl font-semibold text-gray-800">
                                {weather.temperature.toFixed(1)} °F
                            </p>
                            <p className="text-sm text-gray-600">{weather.condition}</p>
                        </>
                    ) : (
                        <p className="text-gray-500 text-sm">Loading...</p>
                    )}
                </div>
            )}
        </div>
    );
}
