'use strict';

// Load environment variables first — before any other require
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');
const analyzeRouter = require('./routes/analyze');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;

// ---------------------------------------------------------------------------
// Global middleware
// ---------------------------------------------------------------------------
app.use(cors({
  origin: '*', // tighten this for production
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// ---------------------------------------------------------------------------
// Request logger (lightweight — no external dependency)
// ---------------------------------------------------------------------------
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------
app.use('/api', analyzeRouter);

// 404 catch-all (must come after routes)
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route not found: ${req.method} ${req.path}` });
});

// ---------------------------------------------------------------------------
// Central error handler (must be last, 4-argument signature)
// ---------------------------------------------------------------------------
app.use(errorHandler);

// ---------------------------------------------------------------------------
// Start server
// ---------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log('=========================================');
  console.log(`  AI Resume Optimizer Backend`);
  console.log(`  AI简历优化助手 后端服务`);
  console.log(`  Running on http://localhost:${PORT}`);
  console.log(`  DEMO_MODE: ${process.env.DEMO_MODE || 'false'}`);
  console.log(`  ZAI_BASE_URL: ${process.env.ZAI_BASE_URL || '(not set)'}`);
  console.log('=========================================');
});

module.exports = app;
