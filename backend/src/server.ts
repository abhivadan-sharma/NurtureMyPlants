import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { identifyPlantRouter } from './routes/identify';
import { generatePdfRouter } from './routes/pdf';
import { shareRouter } from './routes/share';
import { generalApiLimiter } from './middleware/rateLimiting';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Apply general rate limiting to all API routes
app.use('/api', generalApiLimiter);

// Routes
app.use('/api', identifyPlantRouter);
app.use('/api', generatePdfRouter);
app.use('/api', shareRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🌱 NurtureMyPlants API server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
});