const express = require('express');
const axios = require('axios');
const router = express.Router();
const { getCachedData } = require('../utils/cache');
const { getApiHeaders } = require('../utils/apiConfig');
const { query } = require('../utils/db'); // Import DB utility

// Placeholder for sentiment analysis
// In a real application, this would involve a more sophisticated NLP library/service
const analyzeSentiment = (text) => {
  if (!text) return { label: 'neutral', score: 0.0 };
  const lowerText = text.toLowerCase();
  if (lowerText.includes('positive') || lowerText.includes('good') || lowerText.includes('up') || lowerText.includes('rise')) {
    return { label: 'positive', score: 0.75 };
  } else if (lowerText.includes('negative') || lowerText.includes('bad') || lowerText.includes('down') || lowerText.includes('fall')) {
    return { label: 'negative', score: -0.75 };
  }
  return { label: 'neutral', score: 0.0 };
};

const saveNewsArticle = async (article) => {
  const sentiment = analyzeSentiment(article.title + (article.description ? ' ' + article.description : ''));
  const insertQuery = `
    INSERT INTO news_articles (source_id, title, description, url, source, category, country, symbol, published_at, sentiment_label, sentiment_score, raw_data)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    ON CONFLICT (source_id) DO UPDATE SET
      title = EXCLUDED.title,
      description = EXCLUDED.description,
      url = EXCLUDED.url,
      category = EXCLUDED.category,
      country = EXCLUDED.country,
      symbol = EXCLUDED.symbol,
      published_at = EXCLUDED.published_at,
      sentiment_label = EXCLUDED.sentiment_label,
      sentiment_score = EXCLUDED.sentiment_score,
      raw_data = EXCLUDED.raw_data,
      updated_at = CURRENT_TIMESTAMP;
  `;
  // Assuming 'id' or 'article_id' is a unique identifier from the source
  // If not, a combination of fields or a hash might be needed for source_id
  const sourceId = article.id || article.article_id || `${article.title}-${article.date}`; 
  try {
    await query(insertQuery, [
      sourceId,
      article.title,
      article.description,
      article.url,
      'tradingeconomics',
      article.category,
      article.country,
      article.symbol,
      article.date, // Assuming date is in a format PostgreSQL can parse
      sentiment.label,
      sentiment.score,
      article // Store the whole article as JSONB
    ]);
    console.log(`[DB] Saved/Updated article: ${article.title}`);
  } catch (dbError) {
    console.error(`[DB] Error saving article ${article.title}:`, dbError.message);
  }
};

// GET /api/news
router.get('/', async (req, res) => {
  try {
    // Parameter dari query
    const start = req.query.start || 0;
    const size = req.query.size || 100;
    
    // Gunakan cache dengan kunci yang unik berdasarkan parameter
    const cacheKey = `news_${start}_${size}`;
    
    const data = await getCachedData(
      cacheKey, 
      async () => {
        // Fungsi untuk mengambil data jika tidak ada di cache
        const response = await axios.get(
          `https://tradingeconomics.com/ws/stream.ashx?start=${start}&size=${size}&i=markets`,
          { headers: getApiHeaders() }
        );
        const newsData = response.data;
        if (newsData && Array.isArray(newsData)) {
          // Asynchronously save articles to DB without blocking the response
          newsData.forEach(article => saveNewsArticle(article).catch(e => console.error("[DB] Background save failed:", e.message)));
        }
        return newsData;
      }
    );
    
    // Mengembalikan data (dari cache atau hasil fetch)
    res.json(data); // Send response to client
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ 
      error: 'Gagal mengambil data dari Trading Economics',
      message: error.message 
    });
  }
});

// GET /api/news/markets - Berita khusus pasar
router.get('/markets', async (req, res) => {
  try {
    const start = req.query.start || 0;
    const size = req.query.size || 100;
    
    const cacheKey = `news_markets_${start}_${size}`;
    
    const data = await getCachedData(
      cacheKey,
      async () => {
        const response = await axios.get(
          `https://tradingeconomics.com/ws/stream.ashx?start=${start}&size=${size}&i=markets`,
          { headers: getApiHeaders() }
        );
        const newsData = response.data;
        if (newsData && Array.isArray(newsData)) {
          newsData.forEach(article => saveNewsArticle(article).catch(e => console.error("[DB] Background save failed:", e.message)));
        }
        return newsData;
      }
    );
    
    res.json(data); // Send response to client
  } catch (error) {
    console.error('Error fetching markets data:', error);
    res.status(500).json({ error: 'Gagal mengambil data pasar', message: error.message });
  }
});

// GET /api/news/economy - Berita ekonomi
router.get('/economy', async (req, res) => {
  try {
    const start = req.query.start || 0;
    const size = req.query.size || 100;
    
    const cacheKey = `news_economy_${start}_${size}`;
    
    const data = await getCachedData(
      cacheKey,
      async () => {
        const response = await axios.get(
          `https://tradingeconomics.com/ws/stream.ashx?start=${start}&size=${size}&i=economy`,
          { headers: getApiHeaders() }
        );
        const newsData = response.data;
        if (newsData && Array.isArray(newsData)) {
          newsData.forEach(article => saveNewsArticle(article).catch(e => console.error("[DB] Background save failed:", e.message)));
        }
        return newsData;
      }
    );
    
    res.json(data); // Send response to client
  } catch (error) {
    console.error('Error fetching economy data:', error);
    res.status(500).json({ error: 'Gagal mengambil data ekonomi', message: error.message });
  }
});

// GET /api/news/commodity - Berita komoditas
router.get('/commodity', async (req, res) => {
  try {
    const start = req.query.start || 0;
    const size = req.query.size || 100;
    
    const cacheKey = `news_commodity_${start}_${size}`;
    
    const data = await getCachedData(
      cacheKey,
      async () => {
        const response = await axios.get(
          `https://tradingeconomics.com/ws/stream.ashx?start=${start}&size=${size}&i=markets`,
          { headers: getApiHeaders() }
        );
        // Filter hanya berita dengan category "Commodity"
        const allNews = response.data;
        const commodityNews = allNews.filter(item => item.category === "Commodity");
        
        if (commodityNews && Array.isArray(commodityNews)) {
          commodityNews.forEach(article => saveNewsArticle(article).catch(e => console.error("[DB] Background save failed:", e.message)));
        }
        return commodityNews;
      }
    );
    
    res.json(data); // Send response to client
  } catch (error) {
    console.error('Error fetching commodity data:', error);
    res.status(500).json({ error: 'Gagal mengambil data komoditas', message: error.message });
  }
});

// GET /api/news/search - Pencarian berita berdasarkan keyword
router.get('/search', async (req, res) => {
  try {
    const start = req.query.start || 0;
    const size = req.query.size || 100;
    const keyword = req.query.q;
    
    if (!keyword) {
      return res.status(400).json({ error: 'Parameter pencarian (q) diperlukan' });
    }
    
    const cacheKey = `news_search_${keyword}_${start}_${size}`;
    
    const data = await getCachedData(
      cacheKey,
      async () => {
        const response = await axios.get(
          `https://tradingeconomics.com/ws/stream.ashx?start=${start}&size=${size}&i=markets`,
          { headers: getApiHeaders() }
        );
        // Filter berita berdasarkan keyword di judul atau deskripsi
        const allNews = response.data;
        const searchResults = allNews.filter(item => 
          (item.title && item.title.toLowerCase().includes(keyword.toLowerCase())) || 
          (item.description && item.description.toLowerCase().includes(keyword.toLowerCase()))
        );

        if (searchResults && Array.isArray(searchResults)) {
          searchResults.forEach(article => saveNewsArticle(article).catch(e => console.error("[DB] Background save failed:", e.message)));
        }
        return searchResults;
      }
    );
    
    res.json(data); // Send response to client
  } catch (error) {
    console.error('Error searching data:', error);
    res.status(500).json({ error: 'Gagal melakukan pencarian berita', message: error.message });
  }
});

module.exports = router;
