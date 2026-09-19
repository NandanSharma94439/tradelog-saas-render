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
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per window
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', limiter);

// Root & Health check
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'TRADELOG API Server is running.',
    frontendUrl: 'http://localhost:3000',
    docs: '/api/health',
    timestamp: new Date().toISOString()
  });
});

app.get('/favicon.ico', (req, res) => res.status(204).end());

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
