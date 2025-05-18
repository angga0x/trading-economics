# Trading Economics API

REST API sederhana yang mengakses data berita dari Trading Economics.

## Instalasi

1. Clone repositori ini
2. Instal dependensi

```bash
npm install
```

3. Konfigurasi file .env (opsional, sudah ada nilai default)

```
PORT=3000

# Trading Economics API Credentials
TE_APIKEY=android-key
TE_PLAYER_ID=your-player-id
TE_AUTHORIZATION=your-authorization
TE_PLAYER_ID_TYPE=fcm
TE_APP_VERSION=2.7.6
```

4. Jalankan server

```bash
# Mode pengembangan dengan nodemon
npm run dev

# Mode produksi
npm start
```

Server akan berjalan di `http://localhost:3000`

## Endpoint API

### GET /api/news

Mendapatkan berita umum dari Trading Economics.

**Parameter Query:**

- `start` - Indeks awal berita (default: 0)
- `size` - Jumlah berita yang ingin diambil (default: 100)

**Contoh Penggunaan:**

```
GET http://localhost:3000/api/news?start=0&size=50
```

### GET /api/news/markets

Mendapatkan berita khusus pasar keuangan.

**Parameter Query:**

- `start` - Indeks awal berita (default: 0)
- `size` - Jumlah berita yang ingin diambil (default: 100)

**Contoh Penggunaan:**

```
GET http://localhost:3000/api/news/markets?start=0&size=50
```

### GET /api/news/economy

Mendapatkan berita ekonomi.

**Parameter Query:**

- `start` - Indeks awal berita (default: 0)
- `size` - Jumlah berita yang ingin diambil (default: 100)

**Contoh Penggunaan:**

```
GET http://localhost:3000/api/news/economy?start=0&size=50
```

### GET /api/news/commodity

Mendapatkan berita khusus komoditas.

**Parameter Query:**

- `start` - Indeks awal berita (default: 0)
- `size` - Jumlah berita yang ingin diambil (default: 100)

**Contoh Penggunaan:**

```
GET http://localhost:3000/api/news/commodity?start=0&size=50
```

### GET /api/news/search

Mencari berita berdasarkan kata kunci.

**Parameter Query:**

- `q` - Kata kunci pencarian (wajib)
- `start` - Indeks awal berita (default: 0)
- `size` - Jumlah berita yang ingin diambil (default: 100)

**Contoh Penggunaan:**

```
GET http://localhost:3000/api/news/search?q=gold&start=0&size=50
```

### Endpoint Kalender Ekonomi

#### GET /api/calendar

Mendapatkan data kalender ekonomi.

**Parameter Query:**

- `country` - Nama negara (default: 'All' untuk semua negara)
- `startDate` - Tanggal mulai dalam format YYYY-MM-DD (default: hari ini)
- `endDate` - Tanggal akhir dalam format YYYY-MM-DD (default: 30 hari dari hari ini)
- `importance` - Filter berdasarkan tingkat kepentingan (1-3, di mana 3 adalah paling penting)
- `category` - Filter berdasarkan kategori (misalnya: 'GDP', 'Inflation Rate', 'Interest Rate')

**Contoh Penggunaan:**

```
GET http://localhost:3000/api/calendar?country=All&startDate=2025-04-29&endDate=2025-06-30&importance=3
```

#### GET /api/calendar/country/:countryName

Mendapatkan data kalender ekonomi untuk negara tertentu.

**Parameter Path:**

- `countryName` - Nama negara dalam format URL (misal: 'united-states' untuk United States, 'japan' untuk Japan)

**Parameter Query:**

- `startDate` - Tanggal mulai dalam format YYYY-MM-DD (default: hari ini)
- `endDate` - Tanggal akhir dalam format YYYY-MM-DD (default: 30 hari dari hari ini)
- `importance` - Filter berdasarkan tingkat kepentingan (1-3)
- `category` - Filter berdasarkan kategori

**Contoh Penggunaan:**

```
GET http://localhost:3000/api/calendar/country/united-states?startDate=2025-04-29&endDate=2025-05-29&category=Interest%20Rate
```

#### GET /api/calendar/countries

Mendapatkan daftar semua negara yang tersedia dalam kalender ekonomi.

**Contoh Penggunaan:**

```
GET http://localhost:3000/api/calendar/countries
```

**Contoh Respons:**

```json
[
  "Argentina",
  "Australia",
  "Brazil",
  "Canada",
  "China",
  "Euro Area",
  "France",
  "Germany",
  "India",
  "Indonesia",
  "Italy",
  "Japan",
  "Mexico",
  "Russia",
  "Saudi Arabia",
  "South Korea",
  "Turkey",
  "United Kingdom",
  "United States"
  // ... dan negara lainnya
]
```

#### GET /api/calendar/indicator/:indicator

Mendapatkan data kalender ekonomi berdasarkan indikator.

**Parameter Path:**

- `indicator` - Nama indikator (misalnya: 'gdp', 'inflation', 'interest-rate')

**Parameter Query:**

- `startDate` - Tanggal mulai dalam format YYYY-MM-DD (default: hari ini)
- `endDate` - Tanggal akhir dalam format YYYY-MM-DD (default: 30 hari dari hari ini)
- `importance` - Filter berdasarkan tingkat kepentingan (1-3)

**Contoh Penggunaan:**

```
GET http://localhost:3000/api/calendar/indicator/interest-rate?startDate=2025-04-29&endDate=2025-05-29&importance=3
```

#### GET /api/calendar/importance/:level

Mendapatkan data kalender ekonomi berdasarkan tingkat kepentingan.

**Parameter Path:**

- `level` - Tingkat kepentingan event (1-3, di mana 3 adalah paling penting)

**Parameter Query:**

- `country` - Nama negara (default: 'All')
- `startDate` - Tanggal mulai dalam format YYYY-MM-DD (default: hari ini)
- `endDate` - Tanggal akhir dalam format YYYY-MM-DD (default: 30 hari dari hari ini)

**Contoh Penggunaan:**

```
GET http://localhost:3000/api/calendar/importance/3?country=United%20States&startDate=2025-04-29&endDate=2025-05-29
```

#### GET /api/calendar/categories

Mendapatkan daftar semua kategori event yang tersedia dalam kalender ekonomi.

**Contoh Penggunaan:**

```
GET http://localhost:3000/api/calendar/categories
```

**Contoh Respons:**

```json
[
  "Balance of Trade",
  "Consumer Confidence",
  "GDP",
  "Inflation Rate",
  "Interest Rate",
  "Retail Sales",
  "Unemployment Rate"
  // ... dan kategori lainnya
]
```

**Contoh Respons Kalender:**

```json
[
  {
    "CalendarId": "392324",
    "Date": "2025-05-03T16:50:00",
    "Country": "United States",
    "Category": "Interest Rate",
    "Event": "Fed Cook Speech",
    "Reference": "",
    "ReferenceDate": null,
    "Source": "Federal Reserve",
    "SourceURL": "http://www.federalreserve.gov/",
    "Actual": "",
    "Previous": "",
    "Forecast": "",
    "TEForecast": "",
    "URL": "/united-states/interest-rate",
    "DateSpan": "0",
    "Importance": 2,
    "LastUpdate": "2025-05-02T11:23:06.127",
    "Revised": "",
    "Currency": "",
    "Unit": "",
    "Ticker": "FDTR",
    "Symbol": "FDTR"
  },
  // ...
]
```

### Endpoint Analytics

#### GET /api/analytics/commodities/trends

Mendapatkan analisis tren komoditas (naik dan turun).

**Contoh Penggunaan:**

```
GET http://localhost:3000/api/analytics/commodities/trends
```

**Contoh Respons:**

```json
{
  "date": "2023-05-16T12:34:56.789Z",
  "upTrend": [
    {
      "commodity": "Cocoa",
      "slug": "cocoa",
      "change": 3.48,
      "date": "2025-05-16T22:40:17.083"
    },
    // ...
  ],
  "downTrend": [
    {
      "commodity": "Cheese",
      "slug": "cheese",
      "change": -8.14,
      "date": "2025-05-16T22:40:17.083"
    },
    // ...
  ]
}
```

#### GET /api/analytics/commodities/summary

Mendapatkan ringkasan performa komoditas.

**Contoh Penggunaan:**

```
GET http://localhost:3000/api/analytics/commodities/summary
```

**Contoh Respons:**

```json
{
  "date": "2023-05-16T12:34:56.789Z",
  "totalCommodities": 10,
  "rising": 4,
  "falling": 6,
  "averageChange": -0.83,
  "bestPerforming": {
    "commodity": "Cocoa",
    "slug": "cocoa",
    "change": 3.48,
    "date": "2025-05-16T22:40:17.083"
  },
  "worstPerforming": {
    "commodity": "Cheese",
    "slug": "cheese",
    "change": -8.14,
    "date": "2025-05-16T22:40:17.083"
  }
}
```

### Endpoint Admin

#### GET /api/admin/cache/clear

Menghapus semua cache.

**Contoh Penggunaan:**

```
GET http://localhost:3000/api/admin/cache/clear
```

#### GET /api/admin/cache/invalidate/:key

Menghapus cache berdasarkan kunci tertentu.

**Contoh Penggunaan:**

```
GET http://localhost:3000/api/admin/cache/invalidate/news_0_100
```

**Contoh Respons:**

```json
{
  "message": "Cache untuk news_0_100 berhasil dihapus"
}
``` 