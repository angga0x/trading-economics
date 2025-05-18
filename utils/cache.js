/**
 * Modul cache sederhana untuk menyimpan hasil permintaan API
 */

// Simpan hasil cache dalam objek
const cache = {};

// Waktu cache dalam milidetik (default: 5 menit)
const CACHE_TTL = 5 * 60 * 1000;

/**
 * Mendapatkan data dari cache atau mengambilnya melalui fungsi fetch
 * 
 * @param {string} key - Kunci cache
 * @param {Function} fetchFn - Fungsi asinkron untuk mengambil data jika tidak ada di cache
 * @returns {Promise<any>} - Data dari cache atau hasil fetch
 */
const getCachedData = async (key, fetchFn) => {
  const now = Date.now();
  
  // Cek apakah data ada di cache dan masih valid
  if (cache[key] && cache[key].timestamp + CACHE_TTL > now) {
    console.log(`[Cache] Menggunakan data cache untuk: ${key}`);
    return cache[key].data;
  }
  
  // Jika tidak ada di cache atau sudah kedaluwarsa, ambil data baru
  console.log(`[Cache] Mengambil data baru untuk: ${key}`);
  const data = await fetchFn();
  
  // Simpan di cache
  cache[key] = {
    timestamp: now,
    data
  };
  
  return data;
};

/**
 * Menghapus entri cache berdasarkan kunci
 * 
 * @param {string} key - Kunci cache
 */
const invalidateCache = (key) => {
  if (cache[key]) {
    delete cache[key];
    console.log(`[Cache] Menghapus cache untuk: ${key}`);
    return true;
  }
  return false;
};

/**
 * Menghapus semua cache
 */
const clearCache = () => {
  Object.keys(cache).forEach(key => delete cache[key]);
  console.log('[Cache] Semua cache dihapus');
};

module.exports = {
  getCachedData,
  invalidateCache,
  clearCache
}; 