# Local Development Setup Guide

## Problem
MongoDB connection timeout when running locally on Windows trying to connect to Ubuntu server.

## Solutions

### Option 1: Use Local MongoDB (Recommended for Development)

Install MongoDB locally on Windows:

1. **Download MongoDB Community Server:**
   - Visit: https://www.mongodb.com/try/download/community
   - Download Windows version
   - Install with default settings

2. **Update `.env.local` on Windows:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/attendence
   # Or if you set up authentication:
   MONGODB_URI=mongodb://username:password@localhost:27017/attendence?authSource=admin
   ```

3. **Start MongoDB:**
   ```bash
   # MongoDB usually starts automatically as a service on Windows
   # Or start manually:
   "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath="C:\data\db"
   ```

### Option 2: Use SSH Tunnel (Secure Way to Connect to Remote MongoDB)

Create an SSH tunnel to access MongoDB on Ubuntu server:

1. **Create SSH tunnel:**
   ```bash
   # On Windows (PowerShell or CMD)
   ssh -L 27017:localhost:27017 user@103.14.120.163
   ```

2. **Update `.env.local` on Windows:**
   ```env
   MONGODB_URI=mongodb://Toss:Toss%40123@localhost:27017/attendence?authSource=admin
   ```

3. **Keep SSH tunnel running** while developing

### Option 3: Configure MongoDB on Ubuntu for External Access (Not Recommended)

⚠️ **Security Risk:** Only do this if absolutely necessary.

1. **On Ubuntu server, edit MongoDB config:**
   ```bash
   sudo nano /etc/mongod.conf
   ```

2. **Change bindIp:**
   ```yaml
   net:
     port: 27017
     bindIp: 0.0.0.0  # Allow external connections
   ```

3. **Restart MongoDB:**
   ```bash
   sudo systemctl restart mongod
   ```

4. **Open firewall:**
   ```bash
   sudo ufw allow 27017/tcp
   ```

5. **Keep `.env.local` as is:**
   ```env
   MONGODB_URI=mongodb://Toss:Toss%40123@103.14.120.163:27017/attendence?authSource=admin
   ```

## Recommended Setup

### For Local Development (Windows):
- Use **Option 1** (Local MongoDB) - Fastest and most reliable
- Or **Option 2** (SSH Tunnel) - If you need to use production data

### For Production (Ubuntu Server):
- Always use `localhost` in MongoDB URI:
  ```env
  MONGODB_URI=mongodb://Toss:Toss%40123@localhost:27017/attendence?authSource=admin
  ```

## Quick Fix for Current Issue

**Immediate solution - Update `.env.local` on Windows:**

1. Open `.env.local` file
2. Change MongoDB URI to use SSH tunnel or local MongoDB:

   **For SSH Tunnel (if you have SSH access):**
   ```env
   MONGODB_URI=mongodb://Toss:Toss%40123@localhost:27017/attendence?authSource=admin
   ```
   Then run: `ssh -L 27017:localhost:27017 user@103.14.120.163`

   **For Local MongoDB:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/attendence
   ```

## Testing Connection

After updating `.env.local`, test the connection:

```bash
# Restart your dev server
npm run dev

# Test login API
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"swayam@gmail.com","password":"Swayam@123"}'
```

