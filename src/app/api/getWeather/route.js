import { NextResponse } from 'next/server';

// This will fetch weather data from WeatherAPI
export async function GET() {
  const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
  const city = 'Dublin'; // You can change this to get weather for other cities
  
  try {
//request
    const res = await fetch(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`);

    if (!res.ok) {
      return new NextResponse(JSON.stringify({ error: 'Failed to fetch weather data' }), { status: 500 });
    }

    const data = await res.json();
    
    // Extract the temperature and send it as a response
    const temperature = data.current.temp_c;
    return new NextResponse(JSON.stringify({ temp: temperature }), { status: 200 });
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
