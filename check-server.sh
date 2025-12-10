#!/bin/bash

# Server Status Check Script
# Run this on Ubuntu VPS to diagnose connection issues

echo "🔍 Checking Server Status..."
echo ""

# Check if server is running
echo "1. Checking if Node.js process is running:"
if pgrep -f "node server.js" > /dev/null; then
    echo "   ✅ Node.js server process is running"
    ps aux | grep "node server.js" | grep -v grep
else
    echo "   ❌ Node.js server process is NOT running"
fi
echo ""

# Check if port 8087 is listening
echo "2. Checking if port 8087 is listening:"
if netstat -tuln | grep -q ":8087"; then
    echo "   ✅ Port 8087 is listening"
    netstat -tuln | grep ":8087"
else
    echo "   ❌ Port 8087 is NOT listening"
fi
echo ""

# Check firewall status
echo "3. Checking firewall (UFW) status:"
if command -v ufw &> /dev/null; then
    ufw status | grep 8087 || echo "   ⚠️  Port 8087 might not be open in firewall"
else
    echo "   ⚠️  UFW not found, checking iptables..."
    sudo iptables -L -n | grep 8087 || echo "   ⚠️  Port 8087 not found in iptables rules"
fi
echo ""

# Check if server responds locally
echo "4. Testing local server response:"
if curl -s -o /dev/null -w "%{http_code}" http://localhost:8087 | grep -q "200\|404\|500"; then
    echo "   ✅ Server responds locally"
    curl -s http://localhost:8087 | head -20
else
    echo "   ❌ Server does NOT respond locally"
fi
echo ""

# Check network interfaces
echo "5. Checking network interfaces:"
ip addr show | grep "inet " | grep -v "127.0.0.1"
echo ""

# Check if external IP is accessible
echo "6. Checking external IP binding:"
if netstat -tuln | grep "0.0.0.0:8087" > /dev/null; then
    echo "   ✅ Server is bound to 0.0.0.0:8087 (accessible externally)"
elif netstat -tuln | grep "127.0.0.1:8087" > /dev/null; then
    echo "   ❌ Server is bound to 127.0.0.1:8087 (only localhost)"
    echo "   Fix: Make sure server.js binds to 0.0.0.0"
else
    echo "   ⚠️  Could not determine binding"
fi
echo ""

# Test MongoDB connection
echo "7. Testing MongoDB connection:"
if [ -f .env.local ]; then
    MONGODB_URI=$(grep MONGODB_URI .env.local | cut -d'=' -f2)
    echo "   MongoDB URI: ${MONGODB_URI:0:50}..."
    
    # Extract host from URI
    if echo "$MONGODB_URI" | grep -q "localhost\|127.0.0.1"; then
        echo "   ✅ Using localhost MongoDB (good)"
    else
        echo "   ⚠️  Using external MongoDB"
    fi
else
    echo "   ⚠️  .env.local not found"
fi
echo ""

echo "📋 Summary:"
echo "   - If port is listening but not accessible externally, check firewall"
echo "   - If server is bound to 127.0.0.1, it won't be accessible externally"
echo "   - Make sure to run with PM2 for production: pm2 start ecosystem.config.js"

