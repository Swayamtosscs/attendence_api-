# SSH Tunnel Script for MongoDB Connection
# This script starts an SSH tunnel to connect to MongoDB on Ubuntu server

Write-Host "🔗 Starting SSH Tunnel for MongoDB..." -ForegroundColor Cyan
Write-Host ""

$serverIP = "103.14.120.163"
$localPort = 27017
$remotePort = 27017

Write-Host "Connecting to: $serverIP" -ForegroundColor Yellow
Write-Host "Forwarding: localhost:$localPort -> $serverIP:$remotePort" -ForegroundColor Yellow
Write-Host ""
Write-Host "⚠️  Keep this window open while developing!" -ForegroundColor Red
Write-Host "Press Ctrl+C to stop the tunnel" -ForegroundColor Yellow
Write-Host ""

# Start SSH tunnel
ssh -L ${localPort}:localhost:${remotePort} root@${serverIP}

