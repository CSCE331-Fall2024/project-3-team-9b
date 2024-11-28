'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function WeatherWidget() {
    const [weather, setWeather] = useState<{
        temperature: number; // Fahrenheit
        condition: string;
        icon: string; // Placeholder or dynamic URL
    } | null>(null);

    const [error, setError] = useState<string | null>(null);

    // Fetch weather for College Station
    const fetchWeather = async () => {
        try {
            const response = await fetch(`/api/fetchWeather?city=College Station`);
            const data = await response.json();

            if (response.ok) {
                setWeather({
                    temperature: data.temperature,
                    condition: data.condition,
                    icon: data.icon || '/default-weather.png', // Fallback icon
                });
                setError(null);
            } else {
                setError(data.error);
            }
        } catch (err) {
            console.log(err);
            setError('Failed to fetch weather data.');
        }
    };

    // Fetch weather on page load
    useEffect(() => {
        fetchWeather();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center bg-gradient-to-b from-blue-100 to-blue-300 rounded-lg shadow-lg p-4 w-64">
            <h1 className="text-xl font-bold text-blue-700 mb-2">College Station</h1>
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
                    <p className="text-lg font-semibold text-gray-800">
                        {weather.temperature.toFixed(1)} °F
                    </p>
                    <p className="text-sm text-gray-600">{weather.condition}</p>
                </>
            ) : (
                <p className="text-gray-500 text-sm">Loading...</p>
            )}
        </div>
    );
}
