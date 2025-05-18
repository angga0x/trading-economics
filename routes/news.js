const express = require('express');
const axios = require('axios');
const router = express.Router();
const { getCachedData } = require('../utils/cache');
const { getApiHeaders } = require('../utils/apiConfig');

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
        return response.data;
      }
    );
    
    // Mengembalikan data (dari cache atau hasil fetch)
    res.json(data);
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
        return response.data;
      }
    );
    
    res.json(data);
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
        return response.data;
      }
    );
    
    res.json(data);
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
        const commodityNews = response.data.filter(item => item.category === "Commodity");
        return commodityNews;
      }
    );
    
    res.json(data);
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
        const searchResults = response.data.filter(item => 
          (item.title && item.title.toLowerCase().includes(keyword.toLowerCase())) || 
          (item.description && item.description.toLowerCase().includes(keyword.toLowerCase()))
        );
        return searchResults;
      }
    );
    
    res.json(data);
  } catch (error) {
    console.error('Error searching data:', error);
    res.status(500).json({ error: 'Gagal melakukan pencarian berita', message: error.message });
  }
});

module.exports = router; 