import 'dotenv/config';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import { createServer as createViteServer } from 'vite';
import { initDatabase } from './server/db';
import authRoutes from './server/routes/auth';
import menuRoutes from './server/routes/menu';
import reservationsRoutes from './server/routes/reservations';
import enquiriesRoutes from './server/routes/enquiries';
import galleryRoutes from './server/routes/gallery';
import settingsRoutes from './server/routes/settings';
import uploadRoutes from './server/routes/upload';
import reviewsRoutes from './server/routes/reviews';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize database & seed initial authentic data
  try {
    await initDatabase();
  } catch (err) {
    console.error('Database initialization warning:', err);
  }

  // Essential middlewares
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser());

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      restaurant: 'AL-TAJ HOTEL',
      tagline: 'Aapki Khidmat, Hamara Fakhr',
      urduTagline: 'آپ کی خدمت، ہمارا فخر',
      timestamp: new Date().toISOString()
    });
  });

  // Mount API routes
  app.use('/api/auth', authRoutes);
  app.use('/api', menuRoutes);
  app.use('/api', reservationsRoutes);
  app.use('/api', enquiriesRoutes);
  app.use('/api', galleryRoutes);
  app.use('/api', reviewsRoutes);
  app.use('/api', settingsRoutes);
  app.use('/api', uploadRoutes);

  // Global API 404 handler for unmatched /api routes
  app.use('/api/*', (_req, res) => {
    res.status(404).json({ success: false, message: 'API route not found' });
  });

  // Vite middleware for development or static serving for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[AL-TAJ HOTEL] Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
});
