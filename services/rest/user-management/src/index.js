const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');

const app = express();
const PORT = process.env.PORT || 8080;

// Security middleware
app.use(helmet());
app.use(cors());
app.use(compression());

// Logging
app.use(morgan('combined'));

// Body parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'User Management REST API Documentation',
  swaggerOptions: {
    docExpansion: 'list',
    filter: true,
    showRequestDuration: true
  }
}));

// Health check endpoint
app.get('/health', (req, res) => {
  const memUsage = process.memoryUsage();

  res.json({
    service: 'user-management-rest',
    status: 'SERVING',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    version: '1.0.0',
    protocol: 'REST/HTTP',
    memory: {
      used: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
      total: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`
    },
    stats: {
      totalUsers: 0,
      activeUsers: 0,
      activeSessions: 0
    }
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'User Management REST API',
    version: '1.0.0',
    protocol: 'REST/JSON',
    scope: 'Extended production service',
    documentation: {
      swagger: '/api-docs',
      openapi: '/api-docs/swagger.json'
    },
    endpoints: {
      register: 'POST /api/v1/auth/register',
      login: 'POST /api/v1/auth/login',
      logout: 'POST /api/v1/auth/logout',
      profile: 'GET /api/v1/users/profile',
      updateProfile: 'PUT /api/v1/users/profile',
      changePassword: 'PUT /api/v1/users/password',
      users: 'GET /api/v1/users',
      health: 'GET /health'
    },
    note: 'This is a placeholder implementation. Extended functionality to be implemented in production phase.'
  });
});

// Placeholder API endpoints
app.post('/api/v1/auth/register', (req, res) => {
  res.status(501).json({
    success: false,
    error: 'NotImplemented',
    message: 'User registration endpoint - Implementation pending',
    note: 'This endpoint will be implemented in the production phase'
  });
});

app.post('/api/v1/auth/login', (req, res) => {
  res.status(501).json({
    success: false,
    error: 'NotImplemented',
    message: 'User login endpoint - Implementation pending',
    note: 'This endpoint will be implemented in the production phase'
  });
});

app.get('/api/v1/users/profile', (req, res) => {
  res.status(501).json({
    success: false,
    error: 'NotImplemented',
    message: 'User profile endpoint - Implementation pending',
    note: 'This endpoint will be implemented in the production phase'
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);

  res.status(err.statusCode || 500).json({
    success: false,
    error: err.name || 'InternalServerError',
    message: err.message || 'An unexpected error occurred',
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'NotFound',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    availableEndpoints: ['/api/v1/auth', '/api/v1/users', '/health'],
    note: 'Most endpoints are placeholders - see documentation for implementation status'
  });
});

const server = app.listen(PORT, () => {
  console.log(`User Management REST API running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
  console.log('Note: This is a placeholder service for extended functionality');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

module.exports = app;