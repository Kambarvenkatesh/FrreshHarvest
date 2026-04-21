#!/usr/bin/env node

/**
 * FreshHarvest Application Test Script
 * Tests basic functionality without requiring MongoDB
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/api/test', (req, res) => {
  res.json({
    message: 'FreshHarvest API is working!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Start server for testing
const PORT = process.env.PORT || 5001; // Use 5001 for testing

if (require.main === module) {
  const server = app.listen(PORT, () => {
    console.log(`🚀 FreshHarvest test server running on port ${PORT}`);
    console.log(`📡 Test endpoints:`);
    console.log(`   GET http://localhost:${PORT}/api/test`);
    console.log(`   GET http://localhost:${PORT}/api/health`);
    console.log(`\n✅ Basic server functionality verified!`);
    console.log(`\n📋 Next steps:`);
    console.log(`1. Start MongoDB: mongod`);
    console.log(`2. Run full server: npm start`);
    console.log(`3. Test frontend: cd frontend && npm run dev`);

    // Close after 2 seconds for testing
    setTimeout(() => {
      server.close(() => {
        console.log('\n🛑 Test server closed');
        process.exit(0);
      });
    }, 2000);
  });
}

module.exports = app;