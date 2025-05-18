const express = require('express');
const axios = require('axios');
const router = express.Router();
const { getCachedData } = require('../utils/cache');
const { getApiHeaders } = require('../utils/apiConfig');

// GET /api/calendar
// Mendapatkan kalender ekonomi dengan filter negara dan rentang tanggal
router.get('/', async (req, res) => {
  try {
    // Ambil parameter dari query
    const country = req.query.country || 'All';
    const startDate = req.query.startDate || new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
    const endDate = req.query.endDate;
    const importance = req.query.importance; // Filter berdasarkan importance (1-3)
    const category = req.query.category; // Filter berdasarkan kategori
    
    // Buat tanggal akhir default (30 hari dari tanggal mulai jika tidak disediakan)
    const defaultEndDate = new Date();
    defaultEndDate.setDate(defaultEndDate.getDate() + 30);
    const formattedEndDate = endDate || defaultEndDate.toISOString().split('T')[0];
    
    // Buat kunci cache berdasarkan parameter
    const cacheKey = `calendar_${country}_${startDate}_${formattedEndDate}_${importance || 'all'}_${category || 'all'}`;
    
    const data = await getCachedData(
      cacheKey,
      async () => {
        // Akses API Trading Economics dengan headers
        const response = await axios.get(
          `https://api.tradingeconomics.com/calendar/country/${country}/${startDate}/${formattedEndDate}?f=json`,
          { headers: getApiHeaders() }
        );
        
        let filteredData = response.data;
        
        // Filter berdasarkan importance jika disediakan
        if (importance) {
          const importanceValue = parseInt(importance);
          filteredData = filteredData.filter(item => item.Importance === importanceValue);
        }
        
        // Filter berdasarkan kategori jika disediakan
        if (category) {
          filteredData = filteredData.filter(item => 
            item.Category && item.Category.toLowerCase() === category.toLowerCase()
          );
        }
        
        return filteredData;
      }
    );
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching calendar data:', error);
    res.status(500).json({
      error: 'Gagal mengambil data kalender ekonomi',
      message: error.message
    });
  }
});

// GET /api/calendar/country/:countryName
// Mendapatkan kalender ekonomi untuk negara tertentu
router.get('/country/:countryName', async (req, res) => {
  try {
    const countryName = req.params.countryName;
    // Ubah format countryName jika diperlukan (contoh: "united-states" ke "United States")
    const formattedCountryName = countryName.includes('-') 
      ? countryName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
      : countryName.charAt(0).toUpperCase() + countryName.slice(1);
    
    const startDate = req.query.startDate || new Date().toISOString().split('T')[0];
    const importance = req.query.importance;
    const category = req.query.category;
    
    const defaultEndDate = new Date();
    defaultEndDate.setDate(defaultEndDate.getDate() + 30);
    const endDate = req.query.endDate || defaultEndDate.toISOString().split('T')[0];
    
    const cacheKey = `calendar_country_${formattedCountryName}_${startDate}_${endDate}_${importance || 'all'}_${category || 'all'}`;
    
    const data = await getCachedData(
      cacheKey,
      async () => {
        const response = await axios.get(
          `https://api.tradingeconomics.com/calendar/country/${formattedCountryName}/${startDate}/${endDate}?f=json`,
          { headers: getApiHeaders() }
        );
        
        let filteredData = response.data;
        
        // Filter berdasarkan importance jika disediakan
        if (importance) {
          const importanceValue = parseInt(importance);
          filteredData = filteredData.filter(item => item.Importance === importanceValue);
        }
        
        // Filter berdasarkan kategori jika disediakan
        if (category) {
          filteredData = filteredData.filter(item => 
            item.Category && item.Category.toLowerCase() === category.toLowerCase()
          );
        }
        
        return filteredData;
      }
    );
    
    res.json(data);
  } catch (error) {
    console.error(`Error fetching calendar data for country ${req.params.countryName}:`, error);
    res.status(500).json({
      error: `Gagal mengambil data kalender untuk negara ${req.params.countryName}`,
      message: error.message
    });
  }
});

// GET /api/calendar/indicator/:indicator
// Mendapatkan kalender ekonomi berdasarkan indikator
router.get('/indicator/:indicator', async (req, res) => {
  try {
    const indicator = req.params.indicator;
    const startDate = req.query.startDate || new Date().toISOString().split('T')[0];
    const importance = req.query.importance;
    
    const defaultEndDate = new Date();
    defaultEndDate.setDate(defaultEndDate.getDate() + 30);
    const endDate = req.query.endDate || defaultEndDate.toISOString().split('T')[0];
    
    const cacheKey = `calendar_indicator_${indicator}_${startDate}_${endDate}_${importance || 'all'}`;
    
    const data = await getCachedData(
      cacheKey,
      async () => {
        const response = await axios.get(
          `https://api.tradingeconomics.com/calendar/indicator/${indicator}/${startDate}/${endDate}?f=json`,
          { headers: getApiHeaders() }
        );
        
        let filteredData = response.data;
        
        // Filter berdasarkan importance jika disediakan
        if (importance) {
          const importanceValue = parseInt(importance);
          filteredData = filteredData.filter(item => item.Importance === importanceValue);
        }
        
        return filteredData;
      }
    );
    
    res.json(data);
  } catch (error) {
    console.error(`Error fetching calendar data for indicator ${req.params.indicator}:`, error);
    res.status(500).json({
      error: `Gagal mengambil data kalender untuk indikator ${req.params.indicator}`,
      message: error.message
    });
  }
});

// GET /api/calendar/importance/:level
// Mendapatkan kalender ekonomi berdasarkan tingkat kepentingan (1-3)
router.get('/importance/:level', async (req, res) => {
  try {
    const level = parseInt(req.params.level);
    
    if (isNaN(level) || level < 1 || level > 3) {
      return res.status(400).json({
        error: 'Parameter importance harus berupa angka antara 1-3'
      });
    }
    
    const country = req.query.country || 'All';
    const startDate = req.query.startDate || new Date().toISOString().split('T')[0];
    
    const defaultEndDate = new Date();
    defaultEndDate.setDate(defaultEndDate.getDate() + 30);
    const endDate = req.query.endDate || defaultEndDate.toISOString().split('T')[0];
    
    const cacheKey = `calendar_importance_${level}_${country}_${startDate}_${endDate}`;
    
    const data = await getCachedData(
      cacheKey,
      async () => {
        const response = await axios.get(
          `https://api.tradingeconomics.com/calendar/country/${country}/${startDate}/${endDate}?f=json`,
          { headers: getApiHeaders() }
        );
        
        // Filter hanya event dengan importance yang sesuai
        const filteredData = response.data.filter(item => item.Importance === level);
        return filteredData;
      }
    );
    
    res.json(data);
  } catch (error) {
    console.error(`Error fetching calendar data for importance level ${req.params.level}:`, error);
    res.status(500).json({
      error: `Gagal mengambil data kalender untuk tingkat kepentingan ${req.params.level}`,
      message: error.message
    });
  }
});

// GET /api/calendar/categories
// Mendapatkan daftar semua kategori yang tersedia dalam kalender
router.get('/categories', async (req, res) => {
  try {
    const cacheKey = 'calendar_categories';
    
    const data = await getCachedData(
      cacheKey,
      async () => {
        const response = await axios.get(
          `https://api.tradingeconomics.com/calendar/country/All?f=json`,
          { headers: getApiHeaders() }
        );
        
        // Ekstrak semua kategori unik
        const categories = [...new Set(response.data
          .filter(item => item.Category)
          .map(item => item.Category)
        )].sort();
        
        return categories;
      }
    );
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching calendar categories:', error);
    res.status(500).json({
      error: 'Gagal mengambil daftar kategori kalender',
      message: error.message
    });
  }
});

// GET /api/calendar/countries
// Mendapatkan daftar semua negara yang tersedia dalam kalender
router.get('/countries', async (req, res) => {
  try {
    const cacheKey = 'calendar_countries';
    
    const data = await getCachedData(
      cacheKey,
      async () => {
        const response = await axios.get(
          `https://api.tradingeconomics.com/calendar/country/All?f=json`,
          { headers: getApiHeaders() }
        );
        
        // Ekstrak semua negara unik
        const countries = [...new Set(response.data
          .filter(item => item.Country)
          .map(item => item.Country)
        )].sort();
        
        return countries;
      }
    );
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching calendar countries:', error);
    res.status(500).json({
      error: 'Gagal mengambil daftar negara kalender',
      message: error.message
    });
  }
});

module.exports = router; 