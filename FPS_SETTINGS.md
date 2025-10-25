# FPS Ayarları

## Şu Anki Ayar
- **1 FPS** (1000ms interval) - Optimal ve dengeli

## Değiştirmek İçin

`src/App.tsx` dosyasında 77. satırı değiştirin:

```javascript
// 1 FPS (optimal - şu anki)
const interval = setInterval(fetchMetrics, 1000);

// 2 FPS (daha akıcı)
const interval = setInterval(fetchMetrics, 500);

// 5 FPS (çok akıcı)
const interval = setInterval(fetchMetrics, 200);

// 10 FPS (maksimum - PC'yi yorar)
const interval = setInterval(fetchMetrics, 100);
```

## Kaynak Kullanımı Karşılaştırması

| FPS | Interval | API Calls/Min | Kaynak Kullanımı |
|-----|----------|---------------|------------------|
| 0.33 FPS | 3000ms | 20 | Düşük |
| 1 FPS | 1000ms | 60 | Orta ⭐ Önerilen |
| 2 FPS | 500ms | 120 | Orta-Yüksek |
| 5 FPS | 200ms | 300 | Yüksek |
| 10 FPS | 100ms | 600 | Çok Yüksek |
| 30 FPS | 33ms | 1800 | Maksimum (gereksiz) |

## CPU ve Memory Grafikleri İçin Öneri

**Dashboard/Monitor uygulamaları için 1 FPS ideal:**
- ✅ Yeterince akıcı görünüm
- ✅ Düşük kaynak kullanımı
- ✅ CPU/Memory trendlerini görmek için yeterli
- ✅ Network trafiği az
- ✅ Backend sunucusunu yormaz

**Gaming/Gerçek zamanlı uygulamalar:**
- 10+ FPS gerekir ama bu bir monitor uygulaması değil

## Not
Yüksek FPS (10+) CPU'yu gereksiz yorar ve çok fazla API çağrısı yapar. Dashboard için gerekli değildir.

