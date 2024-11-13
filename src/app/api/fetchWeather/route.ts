import { NextResponse } from 'next/server';

type WeatherData = {
    city: string;
    temperature: number; // Fahrenheit
    windspeed: number; // mph
    condition: string;
    icon: string; // Placeholder or dynamic URL
};

// Map weather conditions to icons
const conditionToIcon: Record<string, string> = {
    Sunny: '/sunny.png',
    Cloudy: '/cloudy.png',
    Rainy: '/rainy.png',
    Default: '/default-weather.png',
};

// Fetch latitude and longitude for a given city using Open-Meteo Geocoding API
async function fetchCoordinates(city: string) {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}`;
    const response = await fetch(geoUrl);
    const data = await response.json();

    if (response.ok && data.results && data.results.length > 0) {
        const { latitude, longitude, name } = data.results[0];
        return { latitude, longitude, name };
    }
    throw new Error('City not found');
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');

    if (!city) {
        return NextResponse.json({ error: 'City is required' }, { status: 400 });
    }

    try {
        // Get latitude and longitude dynamically
        const { latitude, longitude, name } = await fetchCoordinates(city);

        // Fetch weather data using latitude and longitude
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph`;
        const response = await fetch(weatherUrl);
        const data = await response.json();

        if (!response.ok || !data.current_weather) {
            throw new Error('Error fetching weather data');
        }

        const condition = 'Sunny'; // Replace with dynamic condition mapping if available
        const weatherInfo: WeatherData = {
            city: name,
            temperature: data.current_weather.temperature,
            windspeed: data.current_weather.windspeed,
            condition: condition,
            icon: conditionToIcon[condition] || conditionToIcon.Default,
        };

        return NextResponse.json(weatherInfo);
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error:', error.message);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
}
