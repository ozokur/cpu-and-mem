# CPU and Memory Monitor

Sistem kaynaklarınızı gerçek zamanlı olarak izleyin! CPU, Memory, Disk ve Network kullanımını grafiklerle görselleştirin.

## 🚀 Hızlı Başlangıç

### Kolay Yöntem (.bat dosyası ile)

1. `start.bat` dosyasına çift tıklayın
2. Tarayıcı otomatik açılacak
3. Uygulama `http://localhost:3000` adresinde çalışacak

### Manuel Başlatma

```bash
# 1. Backend sunucusunu başlatın (port 9191)
npm run server

# 2. Yeni bir terminal açın ve frontend'i başlatın (port 3000)
npm start
```

### Kapatma

- `stop.bat` dosyasına çift tıklayın VEYA
- Tüm terminal pencerelerini kapatın

## 📊 Özellikler

- **CPU Kullanımı**: Gerçek zamanlı CPU yüzdesi ve grafik
- **Memory Kullanımı**: RAM kullanımı ve grafik (GB cinsinden)
- **Disk Aktivitesi**: Okuma/yazma hızları
- **Network Kullanımı**: Upload/Download yük göstergesi
  - Upload: Max 5 MB/s (0-100% scale)
  - Download: Max 60 MB/s (0-100% scale)
- **Process Listesi**: En çok kaynak kullanan process'ler

## 🛠️ Teknolojiler

- **Frontend**: React + TypeScript + Tailwind CSS + Recharts
- **Backend**: Node.js + Express + SystemInformation

## 📦 Kurulum

```bash
npm install
```

## 🌐 Portlar

- **Backend API**: http://localhost:9191
- **Frontend**: http://localhost:3000

## 📝 API Endpoints

- `GET /api/metrics` - Sistem metrikleri (CPU, Memory, Disk, Network)
- `GET /api/processes` - Process listesi

## 📸 Görüntüler

Uygulama modern ve kullanıcı dostu bir arayüze sahiptir. Canlı grafikler ve kartlar ile sistem kaynaklarınızı kolayca takip edebilirsiniz.

## 🔧 Özelleştirme

Network maksimum değerlerini değiştirmek için `server.js` dosyasını düzenleyin:

```javascript
// Upload için max değer (MB/s)
upload için max 5 MB/s

// Download için max değer (MB/s)
download için max 60 MB/s
```

## ⚠️ Notlar

- Windows'ta çalışır
- Backend sunucusu olmadan frontend çalışmaz
- Sistem bilgilerine erişim için yönetici hakları gerekmez

## 📄 Lisans

MIT
