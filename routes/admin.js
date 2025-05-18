const express = require('express');
const router = express.Router();
const { clearCache, invalidateCache } = require('../utils/cache');

// GET /api/admin/cache/clear - Menghapus semua cache
router.get('/cache/clear', (req, res) => {
  clearCache();
  res.json({ message: 'Semua cache berhasil dihapus' });
});

// GET /api/admin/cache/invalidate/:key - Menghapus cache tertentu
router.get('/cache/invalidate/:key', (req, res) => {
  const key = req.params.key;
  const result = invalidateCache(key);
  
  if (result) {
    res.json({ message: `Cache untuk ${key} berhasil dihapus` });
  } else {
    res.status(404).json({ message: `Cache untuk ${key} tidak ditemukan` });
  }
});

module.exports = router; 