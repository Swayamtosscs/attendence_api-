# MongoDB Connection Troubleshooting Guide

## Problem
Getting `connect ETIMEDOUT 103.14.120.163:27017` error when trying to connect to MongoDB.

## Step-by-Step Fix

### 1. Check if MongoDB is Running
```bash
# Check MongoDB status
sudo systemctl status mongod

# If not running, start it
sudo systemctl start mongod

# Enable MongoDB to start on boot
sudo systemctl enable mongod
```

### 2. Check MongoDB Configuration

Edit MongoDB config file:
```bash
sudo nano /etc/mongod.conf
```

**Important:** Make sure these settings are correct:

```yaml
# Network interfaces
net:
  port: 27017
  bindIp: 0.0.0.0  # Change from 127.0.0.1 to 0.0.0.0 to allow external connections

# Security
security:
  authorization: enabled  # Make sure this is enabled if using authentication
```

**After editing, restart MongoDB:**
```bash
sudo systemctl restart mongod
```

### 3. Check Firewall Rules

Allow MongoDB port (27017) through firewall:
```bash
# Check firewall status
sudo ufw status

# Allow MongoDB port
sudo ufw allow 27017/tcp

# If using iptables
sudo iptables -A INPUT -p tcp --dport 27017 -j ACCEPT
sudo iptables-save
```

### 4. Verify MongoDB is Listening on All Interfaces

```bash
# Check what MongoDB is listening on
sudo netstat -tulpn | grep 27017
# or
sudo ss -tulpn | grep 27017

# Should show: 0.0.0.0:27017 (not 127.0.0.1:27017)
```

### 5. Test MongoDB Connection Locally

```bash
# Test connection from the server itself
mongosh "mongodb://Toss:Toss%40123@localhost:27017/attendence?authSource=admin"

# Or test with mongosh
mongosh --host localhost --port 27017 -u Toss -p 'Toss@123' --authenticationDatabase admin
```

### 6. Test MongoDB Connection from External

From your local machine or another server:
```bash
# Test connection
mongosh "mongodb://Toss:Toss%40123@103.14.120.163:27017/attendence?authSource=admin"
```

### 7. Check MongoDB Logs

```bash
# View MongoDB logs for connection errors
sudo tail -f /var/log/mongodb/mongod.log

# Or if logs are in different location
sudo journalctl -u mongod -f
```

### 8. Verify MongoDB User and Database

```bash
# Connect to MongoDB
mongosh --host localhost --port 27017 -u Toss -p 'Toss@123' --authenticationDatabase admin

# Once connected, verify database exists
use attendence
show collections

# Verify user has access
db.getUsers()
```

### 9. Alternative: Use Localhost if MongoDB is on Same Server

If MongoDB is running on the same Ubuntu server as your Node.js app, you can use `localhost` instead of the external IP:

**Update `.env.local` on Ubuntu server:**
```bash
# On Ubuntu server
nano /var/www/html/attendence_api/.env.local
```

Change:
```env
MONGODB_URI=mongodb://Toss:Toss%40123@localhost:27017/attendence?authSource=admin
```

**This is more secure and faster!**

### 10. Restart Your Node.js Application

After fixing MongoDB configuration:
```bash
# If using PM2
pm2 restart attendance-api

# Check logs
pm2 logs attendance-api
```

## Common Issues and Solutions

### Issue 1: MongoDB only listening on 127.0.0.1
**Solution:** Change `bindIp` to `0.0.0.0` in `/etc/mongod.conf` and restart.

### Issue 2: Firewall blocking connections
**Solution:** Allow port 27017: `sudo ufw allow 27017/tcp`

### Issue 3: MongoDB not running
**Solution:** Start MongoDB: `sudo systemctl start mongod`

### Issue 4: Authentication failed
**Solution:** Verify username/password and `authSource` in connection string.

### Issue 5: Database doesn't exist
**Solution:** Create database or use existing one. MongoDB creates databases automatically on first write.

## Security Note

⚠️ **Important:** Exposing MongoDB to the internet (0.0.0.0) is a security risk. Consider:
1. Using `localhost` if Node.js app is on the same server
2. Setting up MongoDB to only accept connections from specific IPs
3. Using a VPN or SSH tunnel
4. Enabling MongoDB's built-in firewall/IP whitelist

## Quick Test Commands

```bash
# 1. Check MongoDB status
sudo systemctl status mongod

# 2. Check if port is open
sudo netstat -tulpn | grep 27017

# 3. Test local connection
mongosh "mongodb://Toss:Toss%40123@localhost:27017/attendence?authSource=admin"

# 4. Check firewall
sudo ufw status

# 5. View MongoDB config
cat /etc/mongod.conf | grep -A 5 "net:"
```

