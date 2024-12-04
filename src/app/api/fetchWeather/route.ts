import { NextResponse } from 'next/server';

type WeatherData = {
    city: string;
    temperature: number; // Fahrenheit
    windspeed: number; // mph
    condition: string; // Human-readable weather condition
    icon: string; // URL or path to the appropriate weather icon
};

// Simplified weather condition mapping
const conditionToIcon: Record<string, string> = {
    Sunny: '/sunny.png',
    Cloudy: '/cloudy.png',
    Rainy: '/rainy.png',
    Default: '/default-weather.png',
};

// Group weather codes into broader categories
const weatherCodeToCondition: Record<number, string> = {
    // Clear/Sunny
    0: 'Sunny',
    1: 'Sunny',
    2: 'Cloudy',
    3: 'Cloudy',

    // Rainy/Showers
    51: 'Rainy',
    53: 'Rainy',
    55: 'Rainy',
    61: 'Rainy',
    63: 'Rainy',
    65: 'Rainy',
    80: 'Rainy',
    81: 'Rainy',
    95: 'Rainy',
};

// Fetch city coordinates using the Open-Meteo geocoding API
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

// Weather API handler
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');

    if (!city) {
        return NextResponse.json({ error: 'City is required' }, { status: 400 });
    }

    try {
        const { latitude, longitude, name } = await fetchCoordinates(city);

        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph`;
        const response = await fetch(weatherUrl);
        const data = await response.json();

        if (!response.ok || !data.current_weather) {
            throw new Error('Error fetching weather data');
        }

        const weatherCode = data.current_weather.weathercode;
        // Handle fallback directly instead of including "Default" in the Record
        const conditionKey =
            weatherCodeToCondition[weatherCode] || 'Default';
        const icon = conditionToIcon[conditionKey] || conditionToIcon.Default;

        const weatherInfo: WeatherData = {
            city: name,
            temperature: data.current_weather.temperature,
            windspeed: data.current_weather.windspeed,
            condition: conditionKey,
            icon: icon,
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
