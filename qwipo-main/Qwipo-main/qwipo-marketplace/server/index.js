const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config({ path: './config.env' });

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const recommendationRoutes = require('./routes/recommendations');
const loyaltyRoutes = require('./routes/loyalty');
const searchRoutes = require('./routes/search');
const analyticsRoutes = require('./routes/analytics');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');
const apiGateway = require('./middleware/apiGateway');

const app = express();
const server = createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    // Allow localhost and 127.0.0.1 (any port) in development; in prod use SOCKET_CORS_ORIGIN
    origin: (origin, callback) => {
      const allowedOrigins = process.env.SOCKET_CORS_ORIGIN
        ? process.env.SOCKET_CORS_ORIGIN.split(',').map(s => s.trim())
        : [];
      if (!origin) return callback(null, true);
      const allowDev = [/^http:\/\/localhost:\d+$/, /^http:\/\/127\.0\.0\.1:\d+$/].some(r => r.test(origin));
      const allowEnv = allowedOrigins.includes(origin);
      if (allowDev || allowEnv) return callback(null, true);
      return callback(new Error('Not allowed by Socket.IO CORS'));
    },
    methods: ["GET", "POST"]
  }
});

// Security middleware
app.use(helmet());
app.use(mongoSanitize());
app.use(hpp());

// API Gateway middleware
app.use(apiGateway.logRequest);
app.use(apiGateway.sanitizeRequest);
app.use(apiGateway.formatResponse);

// Rate limiting with API Gateway
app.use('/api/', apiGateway.getRateLimiter('general'));
app.use('/api/auth/', apiGateway.getRateLimiter('auth'));
app.use('/api/search/', apiGateway.getRateLimiter('search'));
app.use('/api/recommendations/', apiGateway.getRateLimiter('recommendations'));

// CORS configuration (dev + configurable prod)
// Allows localhost:* and 127.0.0.1:* always; plus any origins in CORS_ORIGINS (comma separated)
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // mobile apps / curl

    const allowLocal = [/^http:\/\/localhost:\d+$/, /^http:\/\/127\.0\.0\.1:\d+$/].some(r => r.test(origin));
    const allowedFromEnv = (process.env.CORS_ORIGINS || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    if (allowLocal || allowedFromEnv.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Explicitly handle preflight
app.options('*', cors());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression and logging
app.use(compression());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('join_room', (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room: ${room}`);
  });
  
  socket.on('leave_room', (room) => {
    socket.leave(room);
    console.log(`User ${socket.id} left room: ${room}`);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Make io accessible to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

  // API Routes
// Health check and metrics endpoints
app.get('/health', apiGateway.healthCheck);
app.get('/metrics', apiGateway.getMetrics);

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/loyalty', loyaltyRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Qwipo Marketplace API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Favicon handler to avoid noisy 404/500 in dev tools
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Error handling middleware
app.use(notFound);
app.use(apiGateway.errorHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 API URL: http://localhost:${PORT}/api`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
    mongoose.connection.close();
  });
});

module.exports = { app, io };
