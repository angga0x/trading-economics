const express = require('express');
const axios = require('axios');
const router = express.Router();
const { getCachedData } = require('../utils/cache');
const { getApiHeaders } = require('../utils/apiConfig');

// GET /api/analytics/commodities/trends
// Mendapatkan tren komoditas (naik dan turun)
router.get('/commodities/trends', async (req, res) => {
  try {
    const cacheKey = 'analytics_commodities_trends';
    
    const data = await getCachedData(
      cacheKey,
      async () => {
        // Ambil data komoditas dari Trading Economics
        const response = await axios.get(
          'https://tradingeconomics.com/ws/stream.ashx?start=0&size=100&i=markets',
          { headers: getApiHeaders() }
        );
        
        // Filter hanya berita komoditas
        const commodityNews = response.data.filter(item => item.category === "Commodity");
        
        // Analisis tren pasar komoditas
        const upTrend = [];
        const downTrend = [];
        
        commodityNews.forEach(news => {
          // Parse HTML content untuk mengekstrak data komoditas
          const html = news.html || '';
          
          // Cari komoditas yang naik (dengan warna hijau dalam HTML)
          const upMatches = html.match(/href="\/commodity\/([^"]+)"[^>]*>([^<]+)<\/a>\s*\(<span style="color:#4CAF50;">[+]?([\d.]+)%<\/span>/g);
          if (upMatches) {
            upMatches.forEach(match => {
              const details = match.match(/href="\/commodity\/([^"]+)"[^>]*>([^<]+)<\/a>\s*\(<span style="color:#4CAF50;">[+]?([\d.]+)%<\/span>/);
              if (details) {
                upTrend.push({
                  commodity: details[2],
                  slug: details[1],
                  change: parseFloat(details[3]),
                  date: news.date
                });
              }
            });
          }
          
          // Cari komoditas yang turun (dengan warna merah dalam HTML)
          const downMatches = html.match(/href="\/commodity\/([^"]+)"[^>]*>([^<]+)<\/a>\s*\(<span style="color:#F44336;">-([\d.]+)%<\/span>/g);
          if (downMatches) {
            downMatches.forEach(match => {
              const details = match.match(/href="\/commodity\/([^"]+)"[^>]*>([^<]+)<\/a>\s*\(<span style="color:#F44336;">-([\d.]+)%<\/span>/);
              if (details) {
                downTrend.push({
                  commodity: details[2],
                  slug: details[1],
                  change: -parseFloat(details[3]),
                  date: news.date
                });
              }
            });
          }
        });
        
        // Urutkan berdasarkan perubahan persentase
        upTrend.sort((a, b) => b.change - a.change);
        downTrend.sort((a, b) => a.change - b.change);
        
        return {
          date: new Date().toISOString(),
          upTrend,
          downTrend
        };
      }
    );
    
    res.json(data);
  } catch (error) {
    console.error('Error analyzing commodity trends:', error);
    res.status(500).json({ 
      error: 'Gagal menganalisis tren komoditas', 
      message: error.message 
    });
  }
});

// GET /api/analytics/commodities/summary
// Ringkasan performa komoditas
router.get('/commodities/summary', async (req, res) => {
  try {
    const cacheKey = 'analytics_commodities_summary';
    
    const data = await getCachedData(
      cacheKey,
      async () => {
        // Ambil tren komoditas dari endpoint kita sendiri dengan headers
        const apiUrl = req.protocol + '://' + req.get('host');
        const trendResponse = await axios.get(`${apiUrl}/api/analytics/commodities/trends`);
        const trends = trendResponse.data;
        
        // Hitung statistik ringkasan
        const allCommodities = [...trends.upTrend, ...trends.downTrend];
        
        // Hitung rata-rata perubahan
        const totalChange = allCommodities.reduce((sum, item) => sum + item.change, 0);
        const averageChange = allCommodities.length > 0 ? totalChange / allCommodities.length : 0;
        
        // Temukan komoditas dengan performa terbaik dan terburuk
        const bestPerforming = trends.upTrend.length > 0 ? trends.upTrend[0] : null;
        const worstPerforming = trends.downTrend.length > 0 ? trends.downTrend[0] : null;
        
        return {
          date: new Date().toISOString(),
          totalCommodities: allCommodities.length,
          rising: trends.upTrend.length,
          falling: trends.downTrend.length,
          averageChange,
          bestPerforming,
          worstPerforming
        };
      }
    );
    
    res.json(data);
  } catch (error) {
    console.error('Error creating commodity summary:', error);
    res.status(500).json({ 
      error: 'Gagal membuat ringkasan komoditas', 
      message: error.message 
    });
  }
});

module.exports = router; 