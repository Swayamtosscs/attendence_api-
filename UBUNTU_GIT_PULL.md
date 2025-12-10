# Ubuntu me GitHub se Code Pull Karne ke Steps

## Step 1: Repository Directory me jao
```bash
cd /var/www/html/attendence_api
# Ya jahan bhi tumhara project hai
```

## Step 2: Current Status Check karo
```bash
git status
```

## Step 3: Remote Repository Check karo
```bash
git remote -v
```
Expected output:
```
origin  https://github.com/swayamtosscs-svg/attendence_api-.git (fetch)
origin  https://github.com/swayamtosscs-svg/attendence_api-.git (push)
```

## Step 4: Latest Code Pull karo
```bash
git pull origin main
```

## Agar Error aaye to:

### Error 1: "Your local changes would be overwritten"
**Solution:**
```bash
# Pehle changes stash karo
git stash

# Phir pull karo
git pull origin main

# Stashed changes wapas lao (agar chahiye)
git stash pop
```

### Error 2: "Permission denied"
**Solution:**
```bash
# SSH key setup karo ya HTTPS credentials use karo
git pull origin main
# Username aur password enter karo
```

### Error 3: "Repository not found"
**Solution:**
```bash
# Remote URL check karo
git remote set-url origin https://github.com/swayamtosscs-svg/attendence_api-.git

# Phir pull karo
git pull origin main
```

### Error 4: "Already up to date" (but code nahi aaya)
**Solution:**
```bash
# Force fetch karo
git fetch origin

# Hard reset karo (WARNING: Local changes delete ho jayengi)
git reset --hard origin/main
```

## Complete Commands Sequence:

```bash
# 1. Project directory me jao
cd /var/www/html/attendence_api

# 2. Current branch check karo
git branch

# 3. Remote repository verify karo
git remote -v

# 4. Latest changes fetch karo
git fetch origin

# 5. Pull karo
git pull origin main

# 6. Status check karo
git status

# 7. Latest commit check karo
git log -1
```

## Force Pull (Agar kuch issue ho):

```bash
# Pehle backup lo (optional)
cp -r /var/www/html/attendence_api /var/www/html/attendence_api_backup

# Hard reset
git fetch origin
git reset --hard origin/main

# Dependencies install karo
npm install
```

## Verify karo ki code aaya:

```bash
# Check karo ki new files hain
ls -la src/app/api/chat/
ls -la src/app/api/users/me/

# Check latest commit
git log --oneline -5
```

## Expected New Files:
- `src/app/api/chat/` (folder with messaging APIs)
- `src/app/api/users/me/avatar/` (profile picture API)
- `src/models/Message.ts`
- `src/lib/file-utils.ts`
- `server.js`
- `MESSAGES_CURL_COMMANDS.md`


