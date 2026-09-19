import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.js';
import tradeRoutes from './routes/trades.js';
import analyticsRoutes from './routes/analytics.js';
import setupRoutes from './routes/setups.js';
import goalRoutes from './routes/goals.js';
import profileRoutes from './routes/profile.js';
import exportRoutes from './routes/export.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use('/api', limiter);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/trades', tradeRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/setups', setupRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/export', exportRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'TRADELOG API', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 TRADELOG API Server listening on port ${PORT}`);
});
