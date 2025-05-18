const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const newsRouter = require('./routes/news');
const adminRouter = require('./routes/admin');
const analyticsRouter = require('./routes/analytics');
const calendarRouter = require('./routes/calendar');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/news', newsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/calendar', calendarRouter);

// Route untuk halaman utama
app.get('/', (req, res) => {
  res.send('Trading Economics API Server berjalan. Gunakan /api/news untuk mengakses berita.');
});

// Menjalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
}); 