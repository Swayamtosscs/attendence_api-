#!/bin/bash

# Ubuntu VPS Deployment Script for Attendance API
# Run this script on your Ubuntu server

set -e  # Exit on error

echo "🚀 Starting Attendance API Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
   echo -e "${RED}Please don't run as root. Use a regular user with sudo privileges.${NC}"
   exit 1
fi

# Project directory
PROJECT_DIR="/var/www/html/attendence_api"

echo -e "${YELLOW}Step 1: Checking prerequisites...${NC}"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed. Please install Node.js 18+ first.${NC}"
    exit 1
fi

NODE_VERSION=$(node -v)
echo -e "${GREEN}✓ Node.js version: $NODE_VERSION${NC}"

# Check PM2
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}PM2 not found. Installing PM2...${NC}"
    npm install -g pm2
fi
echo -e "${GREEN}✓ PM2 is installed${NC}"

# Check if project directory exists
if [ ! -d "$PROJECT_DIR" ]; then
    echo -e "${RED}Project directory not found: $PROJECT_DIR${NC}"
    echo "Please clone the repository first:"
    echo "  git clone https://github.com/swayamtosscs-svg/attendence_api-.git $PROJECT_DIR"
    exit 1
fi

cd $PROJECT_DIR

echo -e "${YELLOW}Step 2: Pulling latest code...${NC}"
git pull origin main

echo -e "${YELLOW}Step 3: Installing dependencies...${NC}"
npm install

echo -e "${YELLOW}Step 4: Building the application...${NC}"
npm run build

echo -e "${YELLOW}Step 5: Checking environment variables...${NC}"
if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}Creating .env.local from example...${NC}"
    cp env.local.example .env.local
    echo -e "${RED}⚠️  IMPORTANT: Please edit .env.local with your actual values!${NC}"
    echo "   nano .env.local"
    echo ""
    echo "   Make sure to set:"
    echo "   - MONGODB_URI (use localhost if MongoDB is on same server)"
    echo "   - AUTH_SECRET (use a strong random string)"
    read -p "Press Enter after editing .env.local..."
fi

echo -e "${YELLOW}Step 6: Checking MongoDB connection...${NC}"
# Extract MongoDB host from .env.local
MONGODB_HOST=$(grep MONGODB_URI .env.local | cut -d'@' -f2 | cut -d':' -f1)
if [ "$MONGODB_HOST" = "localhost" ] || [ "$MONGODB_HOST" = "127.0.0.1" ]; then
    echo -e "${GREEN}✓ Using localhost MongoDB (recommended)${NC}"
else
    echo -e "${YELLOW}⚠️  Using external MongoDB: $MONGODB_HOST${NC}"
    echo "   Make sure MongoDB is accessible and firewall allows connections"
fi

echo -e "${YELLOW}Step 7: Setting up PM2...${NC}"
# Stop existing process if running
pm2 stop attendance-api 2>/dev/null || true
pm2 delete attendance-api 2>/dev/null || true

# Start with PM2
pm2 start ecosystem.config.js
pm2 save

echo -e "${YELLOW}Step 8: Setting up PM2 startup...${NC}"
pm2 startup | grep "sudo" | bash || echo "PM2 startup already configured"

echo -e "${YELLOW}Step 9: Checking firewall...${NC}"
if command -v ufw &> /dev/null; then
    if sudo ufw status | grep -q "8087/tcp"; then
        echo -e "${GREEN}✓ Port 8087 is already allowed${NC}"
    else
        echo -e "${YELLOW}Opening port 8087 in firewall...${NC}"
        sudo ufw allow 8087/tcp
        echo -e "${GREEN}✓ Port 8087 opened${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  UFW not found. Make sure port 8087 is open in your firewall${NC}"
fi

echo -e "${YELLOW}Step 10: Verifying server status...${NC}"
sleep 2
pm2 status

echo ""
echo -e "${GREEN}✅ Deployment completed!${NC}"
echo ""
echo "Server should be running at: http://103.14.120.163:8087"
echo ""
echo "Useful commands:"
echo "  pm2 status              - Check server status"
echo "  pm2 logs attendance-api - View logs"
echo "  pm2 restart attendance-api - Restart server"
echo "  pm2 monit               - Monitor resources"
echo ""

