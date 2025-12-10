// Load environment variables first (before requiring socket-server)
// Try .env.local first, then fallback to .env
require('dotenv').config({ path: '.env.local' });
require('dotenv').config(); // This will load .env if .env.local doesn't exist

const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { initializeSocket } = require("./src/lib/socket-server");

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOST || "0.0.0.0";
// Default port: 8092 for production, can be overridden via PORT env variable
const port = parseInt(process.env.PORT || "8092", 10);
const externalIP = "103.14.120.163";

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

const startTime = Date.now();

app.prepare().then(() => {
  
  const server = createServer(async (req, res) => {
    // Add security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  });

  // Initialize Socket.io
  initializeSocket(server);

  server.listen(port, hostname, (err) => {
    if (err) {
      console.error('❌ Server failed to start:', err);
      process.exit(1);
    }
    
    const readyTime = ((Date.now() - startTime) / 1000).toFixed(1);
    
    // Display similar to Next.js dev server output
    console.log('');
    console.log('  ▲ Next.js 14.2.4');
    console.log(`  - Local:        http://localhost:${port}`);
    console.log(`  - Network:      http://${hostname}:${port}`);
    if (externalIP && hostname === '0.0.0.0') {
      console.log(`  - External:     http://${externalIP}:${port}`);
    }
    console.log(`  - Environment:  ${dev ? 'development' : 'production'}`);
    console.log('');
    console.log(`  ✓ Ready in ${readyTime}s`);
    console.log(`  > Socket.io ready on ws://${hostname === '0.0.0.0' ? externalIP : hostname}:${port}/socket.io`);
    console.log('');
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('🛑 SIGTERM received, shutting down gracefully');
    server.close(() => {
      console.log('✅ Process terminated');
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    console.log('🛑 SIGINT received, shutting down gracefully');
    server.close(() => {
      console.log('✅ Process terminated');
      process.exit(0);
    });
  });
}).catch((err) => {
  console.error('❌ Failed to prepare Next.js app:', err);
  process.exit(1);
});

