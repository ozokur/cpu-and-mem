import React, { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Cpu, HardDrive, Database, Activity, TrendingUp, TrendingDown, ThermometerSun } from 'lucide-react';
import './App.css';

interface Metrics {
  cpu: number;
  memory: {
    used: number;
    total: number;
    percent: number;
  };
  temperature: {
    gpu: number;
  };
  network: {
    up: number;
    down: number;
    upRaw: number;
    downRaw: number;
  };
}

interface Process {
  id: number;
  name: string;
  user: string;
  cpu: number;
  memory: number;
}

interface ChartData {
  time: string;
  cpu: number;
  memory: number;
  gpu: number;
}

const App: React.FC = () => {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Her 2 saniyede bir veri çek
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('http://localhost:9191/api/metrics');
        if (!response.ok) throw new Error('API hatası');
        const data = await response.json();
        setMetrics(data);
        setError(null);

        // Chart verisine ekle (30 saniye için 30 veri noktası - her 1 saniyede bir, optimize edilmiş)
        const now = new Date();
        const timeStr = `${now.getMinutes()}:${now.getSeconds().toString().padStart(2, '0')}`;
        setChartData(prev => {
          const newData = [...prev, { 
            time: timeStr, 
            cpu: data.cpu, 
            memory: data.memory.percent,
            gpu: data.temperature.gpu
          }];
          return newData.slice(-30); // Son 30 veriyi tut (30 saniye - daha az memory kullanımı)
        });
      } catch (err) {
        setError('Backend sunucusuna bağlanılamıyor. Lütfen "npm run server" komutunu çalıştırın.');
        console.error('Metrikler alınırken hata:', err);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 1000); // 1 saniyede bir güncelle (1 FPS - optimal)

    return () => clearInterval(interval);
  }, []);

  // Process listesini çek
  useEffect(() => {
    const fetchProcesses = async () => {
      try {
        const response = await fetch('http://localhost:9191/api/processes');
        if (!response.ok) throw new Error('API hatası');
        const data = await response.json();
        setProcesses(data);
      } catch (err) {
        console.error('Process listesi alınırken hata:', err);
      }
    };

    fetchProcesses();
    const interval = setInterval(fetchProcesses, 10000); // 10 saniyede bir güncelle (process listesi çok sık değişmez)

    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md">
          <div className="text-red-600 text-center">
            <Activity className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Bağlantı Hatası</h2>
            <p className="text-gray-700">{error}</p>
            <p className="text-sm text-gray-500 mt-4">
              Yeni bir terminal açın ve şu komutu çalıştırın:
            </p>
            <code className="block bg-gray-100 p-2 rounded mt-2 text-sm">
              npm run server
            </code>
          </div>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-700">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Activity className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-800">System Monitor</h1>
            </div>
            <div className="text-sm text-gray-600">
              CPU ve Memory İzleme
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* CPU Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Cpu className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm text-gray-500">CPU</span>
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {metrics.cpu.toFixed(1)}%
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${metrics.cpu}%` }}
              ></div>
            </div>
          </div>

          {/* Memory Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-full">
                <Database className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm text-gray-500">Memory</span>
            </div>
            <div className="text-3xl font-bold text-green-600 mb-2">
              {metrics.memory.percent.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">
              {metrics.memory.used.toFixed(2)} GB / {metrics.memory.total.toFixed(2)} GB
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${metrics.memory.percent}%` }}
              ></div>
            </div>
          </div>

          {/* GPU Temperature Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-100 p-3 rounded-full">
                <Database className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-sm text-gray-500">GPU Temp</span>
            </div>
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {metrics.temperature.gpu.toFixed(1)}°C
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
              <div 
                className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (metrics.temperature.gpu / 100) * 100)}%` }}
              ></div>
            </div>
            <div className="text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <ThermometerSun className="w-4 h-4 text-orange-500" />
                <span>Max: 100°C</span>
              </div>
            </div>
          </div>

          {/* Network Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-100 p-3 rounded-full">
                <Activity className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-sm text-gray-500">Network</span>
            </div>
            
            {/* Upload */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-600">Upload</span>
                </div>
                <span className="text-sm font-bold text-orange-600">{metrics.network.up.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${metrics.network.up}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {metrics.network.upRaw ? metrics.network.upRaw.toFixed(2) : '0.00'} MB/s / 5 MB/s max
              </div>
            </div>

            {/* Download */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2">
                  <TrendingDown className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-600">Download</span>
                </div>
                <span className="text-sm font-bold text-orange-600">{metrics.network.down.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${metrics.network.down}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {metrics.network.downRaw ? metrics.network.downRaw.toFixed(2) : '0.00'} MB/s / 60 MB/s max
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* CPU Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">CPU Usage</h2>
            <div style={{ transition: 'all 0.3s ease' }}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="time" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} domain={['auto', 'auto']} />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="cpu" 
                  stroke="#3b82f6" 
                  fillOpacity={1} 
                  fill="url(#colorCpu)"
                  isAnimationActive={false}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
            </div>
          </div>

          {/* Memory Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Memory Usage</h2>
            <div style={{ transition: 'all 0.3s ease' }}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="time" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} domain={['auto', 'auto']} />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="memory" 
                  stroke="#10b981" 
                  fillOpacity={1} 
                  fill="url(#colorMemory)"
                  isAnimationActive={false}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
            </div>
          </div>

          {/* GPU Temperature Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">GPU Temperature</h2>
            <div style={{ transition: 'all 0.3s ease' }}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorGpu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="time" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} domain={['auto', 'auto']} />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="gpu" 
                  stroke="#f97316" 
                  fillOpacity={1} 
                  fill="url(#colorGpu)"
                  isAnimationActive={false}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Processes Table */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Top Processes</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPU %</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Memory (MB)</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {processes.slice(0, 10).map((process) => (
                  <tr key={process.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{process.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{process.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{process.user}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{process.cpu.toFixed(1)}%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{process.memory.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
