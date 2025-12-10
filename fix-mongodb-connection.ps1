# Quick Fix Script for MongoDB Connection
# This script helps you set up MongoDB connection for local development

Write-Host "🔧 MongoDB Connection Fix Script" -ForegroundColor Cyan
Write-Host ""

# Check if .env.local exists
if (Test-Path .env.local) {
    Write-Host "✅ .env.local file found" -ForegroundColor Green
    
    # Read current MongoDB URI
    $currentUri = Get-Content .env.local | Select-String "MONGODB_URI"
    Write-Host "Current MongoDB URI: $currentUri" -ForegroundColor Yellow
    Write-Host ""
    
    Write-Host "Choose an option:" -ForegroundColor Cyan
    Write-Host "1. Use SSH Tunnel (Recommended - No MongoDB install needed)"
    Write-Host "2. Use Local MongoDB (Requires MongoDB installation)"
    Write-Host "3. Keep current remote connection (Requires MongoDB external access)"
    Write-Host ""
    
    $choice = Read-Host "Enter your choice (1/2/3)"
    
    if ($choice -eq "1") {
        Write-Host ""
        Write-Host "📝 Setting up SSH Tunnel configuration..." -ForegroundColor Yellow
        
        # Update .env.local
        $content = Get-Content .env.local
        $newContent = $content | ForEach-Object {
            if ($_ -match "^MONGODB_URI=") {
                "MONGODB_URI=mongodb://Toss:Toss%40123@localhost:27017/attendence?authSource=admin"
            } else {
                $_
            }
        }
        $newContent | Set-Content .env.local
        
        Write-Host "✅ Updated .env.local to use localhost (for SSH tunnel)" -ForegroundColor Green
        Write-Host ""
        Write-Host "📋 Next Steps:" -ForegroundColor Cyan
        Write-Host "1. Open a new PowerShell window"
        Write-Host "2. Run: ssh -L 27017:localhost:27017 root@103.14.120.163"
        Write-Host "3. Keep that SSH tunnel running"
        Write-Host "4. In this window, run: npm run dev"
        Write-Host ""
        
    } elseif ($choice -eq "2") {
        Write-Host ""
        Write-Host "📝 Setting up Local MongoDB configuration..." -ForegroundColor Yellow
        
        # Update .env.local
        $content = Get-Content .env.local
        $newContent = $content | ForEach-Object {
            if ($_ -match "^MONGODB_URI=") {
                "MONGODB_URI=mongodb://localhost:27017/attendence"
            } else {
                $_
            }
        }
        $newContent | Set-Content .env.local
        
        Write-Host "✅ Updated .env.local to use local MongoDB" -ForegroundColor Green
        Write-Host ""
        Write-Host "📋 Next Steps:" -ForegroundColor Cyan
        Write-Host "1. Install MongoDB Community Server from: https://www.mongodb.com/try/download/community"
        Write-Host "2. Make sure MongoDB service is running"
        Write-Host "3. Run: npm run dev"
        Write-Host ""
        
    } else {
        Write-Host ""
        Write-Host "ℹ️  Keeping current remote connection" -ForegroundColor Yellow
        Write-Host "⚠️  Make sure MongoDB on Ubuntu server allows external connections" -ForegroundColor Red
        Write-Host ""
        Write-Host "On Ubuntu server, run:" -ForegroundColor Cyan
        Write-Host "  sudo nano /etc/mongod.conf"
        Write-Host "  # Change bindIp to 0.0.0.0"
        Write-Host "  sudo systemctl restart mongod"
        Write-Host "  sudo ufw allow 27017/tcp"
        Write-Host ""
    }
    
} else {
    Write-Host "❌ .env.local file not found!" -ForegroundColor Red
    Write-Host "Creating from example..." -ForegroundColor Yellow
    Copy-Item env.local.example .env.local
    Write-Host "✅ Created .env.local - Please edit it with your MongoDB URI" -ForegroundColor Green
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

