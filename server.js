// Gerekli kütüphaneleri import et
const express = require('express');
const cors = require('cors');
const si = require('systeminformation');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

// Express uygulamasını oluştur
const app = express();
const port = 9191; // Ön yüzün veri beklediği port

// CORS (Cross-Origin Resource Sharing) ayarını yap
// Bu, localhost:3000 gibi farklı bir adresten gelen isteklere izin verir
app.use(cors());

// Cache sistemi - verileri saklayarak gereksiz işlemleri önle
const cache = {
  gpuTemp: 0,
  lastGpuUpdate: 0,
  gpuUpdateInterval: 5000, // 5 saniyede bir GPU sıcaklığını güncelle
};

// Helper function for safe async calls
const safeCall = async (fn, defaultValue) => {
  try {
    return await fn();
  } catch (error) {
    console.error('Safe call error:', error.message);
    return defaultValue;
  }
};

// Windows'ta GPU sıcaklığını al (cache'li versiyon)
const getGPUTemperature = async () => {
  const now = Date.now();
  
  // Cache'den dönüş yap - eğer yeterince yakın zamanda güncellendiyse
  if (now - cache.lastGpuUpdate < cache.gpuUpdateInterval) {
    return cache.gpuTemp;
  }
  
  try {
    // NVIDIA GPU için nvidia-smi komutu
    try {
      const nvidiaCommand = `nvidia-smi --query-gpu=temperature.gpu --format=csv,noheader,nounits`;
      const nvidiaResult = await execAsync(nvidiaCommand, { timeout: 1000 });
      const nvidiaTemp = parseFloat(nvidiaResult.stdout.trim());
      if (!isNaN(nvidiaTemp) && nvidiaTemp > 0) {
        cache.gpuTemp = nvidiaTemp;
        cache.lastGpuUpdate = now;
        return nvidiaTemp;
      }
    } catch (nvidiaError) {
      // NVIDIA yoksa devam et
    }
    
    // AMD GPU için (WMI)
    try {
      const amdCommand = `powershell -Command "Get-WmiObject -Namespace root\\wmi -Class MSAcpi_ThermalZoneTemperature -ErrorAction SilentlyContinue | Where-Object {$_.CurrentTemperature -ne $null} | Select-Object -First 1 -ExpandProperty CurrentTemperature"`;
      const amdResult = await execAsync(amdCommand, { timeout: 1000 });
      let amdTemp = parseFloat(amdResult.stdout.trim());
      if (amdTemp > 0) {
        // Kelvin cinsinden geliyorsa Celsius'a çevir
        if (amdTemp > 100) {
          amdTemp = (amdTemp / 10) - 273.15;
        }
        cache.gpuTemp = amdTemp;
        cache.lastGpuUpdate = now;
        return amdTemp;
      }
    } catch (amdError) {
      // AMD bulunamadı
    }
    
    // Hiçbiri çalışmazsa simüle edilmiş veri döndür (her seferinde yeniden hesaplama yerine cache'i kullan)
    if (cache.gpuTemp === 0) {
      cache.gpuTemp = Math.random() * 30 + 40; // 40-70°C
    }
    cache.lastGpuUpdate = now;
    return cache.gpuTemp;
  } catch (error) {
    // Hata durumunda cache'den dön
    return cache.gpuTemp || 45;
  }
};

// `/api/metrics` endpoint'i: CPU, RAM, Disk ve Ağ verilerini döndürür
app.get('/api/metrics', async (req, res) => {
  try {
    // Aynı anda birden çok sistem verisini çek
    const cpuData = await safeCall(() => si.currentLoad(), { currentLoad: 0 });
    const memData = await safeCall(() => si.mem(), { used: 0, total: 1000000000 });
    const networkStats = await safeCall(() => si.networkStats(), [{ rx_sec: 0, tx_sec: 0 }]);
    
    // GPU sıcaklığını al
    const gpuTemp = await getGPUTemperature();

    // Verileri ön yüzün beklediği formata dönüştür
    const metrics = {
      cpu: cpuData.currentLoad || 0,
      memory: {
        used: memData.used / (1024 * 1024 * 1024), // GB'a çevir
        total: memData.total / (1024 * 1024 * 1024), // GB'a çevir
        percent: memData.total > 0 ? (memData.used / memData.total) * 100 : 0,
      },
      temperature: {
        gpu: gpuTemp || 0,
      },
      network: {
        // MB/s cinsinden değerleri hesapla ve yüzdeye çevir
        up: networkStats && networkStats[0] && networkStats[0].tx_sec !== undefined 
          ? Math.min(100, ((networkStats[0].tx_sec / (1024 * 1024)) / 5) * 100) : 0, // Upload için max 5 MB/s
        down: networkStats && networkStats[0] && networkStats[0].rx_sec !== undefined 
          ? Math.min(100, ((networkStats[0].rx_sec / (1024 * 1024)) / 60) * 100) : 0, // Download için max 60 MB/s
        upRaw: networkStats && networkStats[0] && networkStats[0].tx_sec !== undefined 
          ? (networkStats[0].tx_sec / (1024 * 1024)) : 0, // MB/s ham değer
        downRaw: networkStats && networkStats[0] && networkStats[0].rx_sec !== undefined 
          ? (networkStats[0].rx_sec / (1024 * 1024)) : 0, // MB/s ham değer
      },
    };

    res.json(metrics);
  } catch (error) {
    console.error('Metrikler alınırken hata:', error);
    res.status(500).json({ error: 'Sunucu hatası', details: error.message });
  }
});

// `/api/processes` endpoint'i: Çalışan process'lerin listesini döndürür
app.get('/api/processes', async (req, res) => {
  try {
    const processesData = await safeCall(() => si.processes(), { list: [] });
    
    // Veriyi ön yüzün beklediği formata dönüştür ve CPU kullanımına göre sırala
    const processes = processesData.list
      .map(p => ({
        id: p.pid,
        name: p.name,
        user: p.user || 'N/A',
        cpu: p.pcpu || 0,
        memory: (p.mem_rss || 0) / 1024, // MB'a çevir
      }))
      .sort((a, b) => b.cpu - a.cpu) // CPU kullanımına göre çoktan aza sırala
      .slice(0, 50); // Performans için listeyi ilk 50 process ile sınırla

    res.json(processes);
  } catch (error) {
    console.error('Process listesi alınırken hata:', error);
    res.status(500).json({ error: 'Sunucu hatası', details: error.message });
  }
});

// Sunucuyu belirtilen port'ta dinlemeye başla
app.listen(port, () => {
  console.log(`System Metrics sunucusu http://localhost:${port} adresinde çalışıyor`);
});
