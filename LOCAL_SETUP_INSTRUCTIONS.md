# Local Development Setup - Quick Start

## Problem
MongoDB connection timeout when running locally.

## Solution: Use SSH Tunnel (Easiest - No MongoDB Install Needed)

### Step 1: Update .env.local ✅ (Already Done)
The `.env.local` file has been updated to use `localhost:27017`

### Step 2: Start SSH Tunnel

**Option A: Use the script (Easiest)**
```powershell
.\start-ssh-tunnel.ps1
```

**Option B: Manual command**
```powershell
ssh -L 27017:localhost:27017 root@103.14.120.163
```

**Important:** Keep the SSH tunnel window open while developing!

### Step 3: Start Dev Server

In a **new PowerShell window**:
```powershell
npm run dev
```

### Step 4: Test

Open browser: `http://localhost:3000/api/auth/login`

Or use curl:
```powershell
curl -X POST http://localhost:3000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"swayam@gmail.com\",\"password\":\"Swayam@123\"}'
```

## Quick Commands

```powershell
# Terminal 1: Start SSH Tunnel
.\start-ssh-tunnel.ps1

# Terminal 2: Start Dev Server
npm run dev
```

## Troubleshooting

### SSH Tunnel Not Working?
1. Make sure you have SSH access to the server
2. Try: `ssh root@103.14.120.163` first to test connection
3. If using different user, update `start-ssh-tunnel.ps1`

### Still Getting Timeout?
1. Check if SSH tunnel is running (keep that window open!)
2. Verify `.env.local` has: `MONGODB_URI=mongodb://Toss:Toss%40123@localhost:27017/attendence?authSource=admin`
3. Restart dev server after starting SSH tunnel

### Alternative: Install MongoDB Locally
If SSH tunnel doesn't work, install MongoDB locally:
1. Download: https://www.mongodb.com/try/download/community
2. Install MongoDB
3. Update `.env.local`: `MONGODB_URI=mongodb://localhost:27017/attendence`

