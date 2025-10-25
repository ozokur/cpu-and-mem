import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChevronDown, Thermometer, Cloud, Sun, MapPin } from 'lucide-react';

interface TemperatureData {
  time: string;
  temperature: number;
}

interface CityData {
  [key: string]: TemperatureData[];
}

const App: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<string>('Istanbul');
  const [temperatureData, setTemperatureData] = useState<TemperatureData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Mock temperature data for different cities
  const citiesData: CityData = {
    Istanbul: [
      { time: '00:00', temperature: 18 },
      { time: '03:00', temperature: 16 },
      { time: '06:00', temperature: 17 },
      { time: '09:00', temperature: 22 },
      { time: '12:00', temperature: 26 },
      { time: '15:00', temperature: 28 },
      { time: '18:00', temperature: 24 },
      { time: '21:00', temperature: 20 },
    ],
    London: [
      { time: '00:00', temperature: 12 },
      { time: '03:00', temperature: 11 },
      { time: '06:00', temperature: 10 },
      { time: '09:00', temperature: 14 },
      { time: '12:00', temperature: 17 },
      { time: '15:00', temperature: 19 },
      { time: '18:00', temperature: 16 },
      { time: '21:00', temperature: 13 },
    ],
    NewYork: [
      { time: '00:00', temperature: 15 },
      { time: '03:00', temperature: 14 },
      { time: '06:00', temperature: 16 },
      { time: '09:00', temperature: 21 },
      { time: '12:00', temperature: 25 },
      { time: '15:00', temperature: 27 },
      { time: '18:00', temperature: 23 },
      { time: '21:00', temperature: 18 },
    ],
    Tokyo: [
      { time: '00:00', temperature: 22 },
      { time: '03:00', temperature: 21 },
      { time: '06:00', temperature: 23 },
      { time: '09:00', temperature: 27 },
      { time: '12:00', temperature: 31 },
      { time: '15:00', temperature: 33 },
      { time: '18:00', temperature: 29 },
      { time: '21:00', temperature: 25 },
    ],
    Paris: [
      { time: '00:00', temperature: 14 },
      { time: '03:00', temperature: 13 },
      { time: '06:00', temperature: 12 },
      { time: '09:00', temperature: 16 },
      { time: '12:00', temperature: 20 },
      { time: '15:00', temperature: 22 },
      { time: '18:00', temperature: 19 },
      { time: '21:00', temperature: 15 },
    ],
  };

  const cities = ['Istanbul', 'London', 'NewYork', 'Tokyo', 'Paris'];

  // Simulate loading and dynamic updates
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API call delay
    const timer = setTimeout(() => {
      setTemperatureData(citiesData[selectedCity] || []);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [selectedCity]);

  // Auto-update data every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (temperatureData.length > 0) {
        setTemperatureData(prevData => 
          prevData.map(item => ({
            ...item,
            temperature: item.temperature + (Math.random() * 2 - 1) // Random variation ±1°C
          }))
        );
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [temperatureData]);

  const currentTemp = temperatureData.length > 0 
    ? temperatureData[Math.floor(temperatureData.length / 2)].temperature 
    : 0;

  const getWeatherIcon = (temp: number) => {
    if (temp >= 25) return <Sun className="w-8 h-8 text-yellow-500" />;
    if (temp >= 15) return <Cloud className="w-8 h-8 text-blue-400" />;
    return <Thermometer className="w-8 h-8 text-blue-600" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Thermometer className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-800">Temperature Monitor</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <MapPin className="w-5 h-5" />
                <span className="font-medium">{selectedCity}</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* City Selector */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select City
          </label>
          <div className="relative">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="appearance-none w-full md:w-64 bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:border-gray-400 transition-colors"
            >
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
          </div>
        </div>

        {/* Current Temperature Card */}
        <div className="mb-8 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm uppercase tracking-wide mb-2">Current Temperature</p>
              <p className="text-5xl font-bold text-gray-800">{currentTemp.toFixed(1)}°C</p>
              <p className="text-gray-600 mt-2">{selectedCity}</p>
            </div>
            <div className="animate-pulse">
              {getWeatherIcon(currentTemp)}
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">24-Hour Temperature Forecast</h2>
            {isLoading && (
              <div className="flex items-center space-x-2 text-blue-600">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <span className="text-sm">Loading...</span>
              </div>
            )}
          </div>
          
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={temperatureData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eeke3" />
              <XAxis 
                dataKey="time" 
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
                labelStyle={{ color: '#6b7280', fontWeight: 'bold' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="temperature" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 5 }}
                activeDot={{ r: 8 }}
                name="Temperature (°C)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Statistics */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Min Temperature</p>
                <p className="text-3xl font-bold text-blue-600">
                  {temperatureData.length > 0 
                    ? Math.min(...temperatureData.map(d => d.temperature)).toFixed(1)
                    : '0'
                  }°C
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Thermometer className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Average Temperature</p>
                <p className="text-3xl font-bold text-green-600">
                  {temperatureData.length > 0
                    ? (temperatureData.reduce((sum, d) => sum + d.temperature, 0) / temperatureData.length).toFixed(1)
                    : '0'
                  }°C
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Cloud className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Max Temperature</p>
                <p className="text-3xl font-bold text-red-600">
                  {temperatureData.length > 0
                    ? Math.max(...temperatureData.map(d => d.temperature)).toFixed(1)
                    : '0'
                  }°C
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <Sun className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
