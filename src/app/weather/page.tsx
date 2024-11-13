'use client';

import Image from 'next/image';
import { useState } from 'react';

function weatherDisplaySquare(icon: string, label: string, value: string | number) {
    return (
        <div className="flex flex-col items-center justify-center bg-white rounded-xl p-4 shadow-md w-64">
            <Image
                src={icon}
                alt="weather icon"
                width={100}
                height={100}
                className="mb-4"
            />
            <div className="bg-gray-200 w-full text-center rounded-lg text-lg font-bold p-2 text-gray-800">{label}</div>
            <div className="bg-gray-100 w-full text-center rounded-lg text-md p-1 text-gray-700">{value}</div>
        </div>
    );
}

export default function WeatherBoardView() {
    const [city, setCity] = useState<string>(''); // Empty input initially
    const [weather, setWeather] = useState<{
        city: string;
        temperature: number; // Fahrenheit
        windspeed: number; // mph
        condition: string;
        icon: string; // Placeholder or dynamic URL
    } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchWeather = async () => {
        if (!city) {
            setError('Please enter a city name.');
            return;
        }

        try {
            const response = await fetch(`/api/fetchWeather?city=${city}`);
            const data = await response.json();

            if (response.ok) {
                setWeather({
                    city: data.city,
                    temperature: data.temperature,
                    windspeed: data.windspeed,
                    condition: data.condition,
                    icon: data.icon, // Dynamic icon URL
                });
                setError(null);
            } else {
                setError(data.error);
                setWeather(null);
            }
        } catch (error) {
            if (error instanceof Error) {
                setError(`Failed to fetch weather data: ${error.message}`);
            } else {
                setError('An unknown error occurred while fetching weather data.');
            }
            setWeather(null);
        }
    };

    return (
        <div className="flex flex-col items-center h-full bg-gradient-to-b from-blue-100 to-blue-300">
            <div className="text-6xl mt-10 mb-4 text-blue-700 font-bold">Weather Dashboard</div>

            <div className="flex items-center gap-2 mb-8">
                <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter city name"
                    className="p-3 text-lg rounded-md shadow-md border-2 border-blue-400 focus:outline-none text-gray-800 bg-white"
                />
                <button
                    onClick={fetchWeather}
                    className="bg-blue-600 text-white text-lg font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-blue-700"
                >
                    Get Weather
                </button>
            </div>

            {error && <p className="text-red-600 text-lg">{error}</p>}

            {weather && (
                <div className="flex flex-col items-center w-full">
                    <div className="text-4xl text-blue-600 font-semibold mb-6">{weather.city}</div>
                    <div className="flex flex-wrap justify-center gap-6">
                        {weatherDisplaySquare(weather.icon, 'Temperature', `${weather.temperature.toFixed(1)} °F`)}
                        {weatherDisplaySquare(weather.icon, 'Condition', weather.condition)}
                        {weatherDisplaySquare(weather.icon, 'Windspeed', `${weather.windspeed.toFixed(1)} mph`)}
                    </div>
                </div>
            )}
        </div>
    );
}
