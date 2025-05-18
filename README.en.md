# Trading Economics API

Simple REST API that accesses news and economic data from Trading Economics.

## Installation

1. Clone this repository
2. Install dependencies

```bash
npm install
```

3. Configure the .env file (optional, default values are provided)

```
PORT=3000

# Trading Economics API Credentials
TE_APIKEY=android-key
TE_PLAYER_ID=your-player-id
TE_AUTHORIZATION=your-authorization
TE_PLAYER_ID_TYPE=fcm
TE_APP_VERSION=2.7.6
```

4. Run the server

```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

The server will run at `http://localhost:3000`

## API Endpoints

### GET /api/news

Get general news from Trading Economics.

**Query Parameters:**

- `start` - Starting index of news (default: 0)
- `size` - Number of news items to retrieve (default: 100)

**Usage Example:**

```
GET http://localhost:3000/api/news?start=0&size=50
```

### GET /api/news/markets

Get market-specific news.

**Query Parameters:**

- `start` - Starting index of news (default: 0)
- `size` - Number of news items to retrieve (default: 100)

**Usage Example:**

```
GET http://localhost:3000/api/news/markets?start=0&size=50
```

### GET /api/news/economy

Get economic news.

**Query Parameters:**

- `start` - Starting index of news (default: 0)
- `size` - Number of news items to retrieve (default: 100)

**Usage Example:**

```
GET http://localhost:3000/api/news/economy?start=0&size=50
```

### GET /api/news/commodity

Get commodity-specific news.

**Query Parameters:**

- `start` - Starting index of news (default: 0)
- `size` - Number of news items to retrieve (default: 100)

**Usage Example:**

```
GET http://localhost:3000/api/news/commodity?start=0&size=50
```

### GET /api/news/search

Search news by keyword.

**Query Parameters:**

- `q` - Search keyword (required)
- `start` - Starting index of news (default: 0)
- `size` - Number of news items to retrieve (default: 100)

**Usage Example:**

```
GET http://localhost:3000/api/news/search?q=gold&start=0&size=50
```

### Economic Calendar Endpoints

#### GET /api/calendar

Get economic calendar data.

**Query Parameters:**

- `country` - Country name (default: 'All' for all countries)
- `startDate` - Start date in YYYY-MM-DD format (default: today)
- `endDate` - End date in YYYY-MM-DD format (default: 30 days from today)
- `importance` - Filter by importance level (1-3, where 3 is most important)
- `category` - Filter by category (e.g., 'GDP', 'Inflation Rate', 'Interest Rate')

**Usage Example:**

```
GET http://localhost:3000/api/calendar?country=All&startDate=2025-04-29&endDate=2025-06-30&importance=3
```

#### GET /api/calendar/country/:countryName

Get economic calendar data for a specific country.

**Path Parameters:**

- `countryName` - Country name in URL format (e.g., 'united-states' for United States, 'japan' for Japan)

**Query Parameters:**

- `startDate` - Start date in YYYY-MM-DD format (default: today)
- `endDate` - End date in YYYY-MM-DD format (default: 30 days from today)
- `importance` - Filter by importance level (1-3)
- `category` - Filter by category

**Usage Example:**

```
GET http://localhost:3000/api/calendar/country/united-states?startDate=2025-04-29&endDate=2025-05-29&category=Interest%20Rate
```

#### GET /api/calendar/countries

Get a list of all countries available in the economic calendar.

**Usage Example:**

```
GET http://localhost:3000/api/calendar/countries
```

**Example Response:**

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
  // ... and other countries
]
```

#### GET /api/calendar/indicator/:indicator

Get economic calendar data by indicator.

**Path Parameters:**

- `indicator` - Indicator name (e.g., 'gdp', 'inflation', 'interest-rate')

**Query Parameters:**

- `startDate` - Start date in YYYY-MM-DD format (default: today)
- `endDate` - End date in YYYY-MM-DD format (default: 30 days from today)
- `importance` - Filter by importance level (1-3)

**Usage Example:**

```
GET http://localhost:3000/api/calendar/indicator/interest-rate?startDate=2025-04-29&endDate=2025-05-29&importance=3
```

#### GET /api/calendar/importance/:level

Get economic calendar data by importance level.

**Path Parameters:**

- `level` - Event importance level (1-3, where 3 is most important)

**Query Parameters:**

- `country` - Country name (default: 'All')
- `startDate` - Start date in YYYY-MM-DD format (default: today)
- `endDate` - End date in YYYY-MM-DD format (default: 30 days from today)

**Usage Example:**

```
GET http://localhost:3000/api/calendar/importance/3?country=United%20States&startDate=2025-04-29&endDate=2025-05-29
```

#### GET /api/calendar/categories

Get a list of all event categories available in the economic calendar.

**Usage Example:**

```
GET http://localhost:3000/api/calendar/categories
```

**Example Response:**

```json
[
  "Balance of Trade",
  "Consumer Confidence",
  "GDP",
  "Inflation Rate",
  "Interest Rate",
  "Retail Sales",
  "Unemployment Rate"
  // ... and other categories
]
```

**Calendar Response Example:**

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

### Analytics Endpoints

#### GET /api/analytics/commodities/trends

Get commodity trend analysis (up and down trends).

**Usage Example:**

```
GET http://localhost:3000/api/analytics/commodities/trends
```

**Example Response:**

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

Get commodity performance summary.

**Usage Example:**

```
GET http://localhost:3000/api/analytics/commodities/summary
```

**Example Response:**

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

### Admin Endpoints

#### GET /api/admin/cache/clear

Clear all cache.

**Usage Example:**

```
GET http://localhost:3000/api/admin/cache/clear
```

#### GET /api/admin/cache/invalidate/:key

Invalidate cache by specific key.

**Usage Example:**

```
GET http://localhost:3000/api/admin/cache/invalidate/news_0_100
```

**Example Response:**

```json
{
  "message": "Cache for news_0_100 has been successfully deleted"
}
``` 