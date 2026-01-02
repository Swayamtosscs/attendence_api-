# Attendance Counts API - cURL Commands (हिंदी में)

**Base URL:** `http://103.14.120.163:8092` (Production) या `http://localhost:3000` (Local)  
**Authentication:** Bearer Token (required)

---

## 📋 Table of Contents

1. [Get Check-In/Check-Out Counts](#1-get-check-incheck-out-counts)
2. [Multiple Check-Ins (Updated API)](#2-multiple-check-ins-updated-api)
3. [Multiple Check-Outs (Updated API)](#3-multiple-check-outs-updated-api)
4. [Complete Example Workflow](#4-complete-example-workflow)

---

## 1. Get Check-In/Check-Out Counts

यह API दिखाता है कि एक दिन में कितनी बार check-in और check-out किया गया है, location-wise।

### 1.1 Today's Counts (आज के counts)

```bash
curl -X GET "http://103.14.120.163:8092/api/attendance/counts" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

### 1.2 Specific Date (किसी specific date के लिए)

```bash
curl -X GET "http://103.14.120.163:8092/api/attendance/counts?date=2024-01-15T00:00:00Z" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

### 1.3 Date Range (Date range के लिए)

```bash
curl -X GET "http://103.14.120.163:8092/api/attendance/counts?startDate=2024-01-01T00:00:00Z&endDate=2024-01-31T23:59:59Z" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

### 1.4 Specific User (किसी specific user के लिए - Admin/Manager only)

```bash
curl -X GET "http://103.14.120.163:8092/api/attendance/counts?userId=507f1f77bcf86cd799439011" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

### 1.5 Local Server

```bash
curl -X GET "http://localhost:3000/api/attendance/counts?date=2024-01-15T00:00:00Z" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

### Expected Response

```json
{
  "success": true,
  "data": [
    {
      "date": "2024-01-15T00:00:00.000Z",
      "location": {
        "latitude": 28.7041,
        "longitude": 77.1025
      },
      "checkIns": 3,
      "checkOuts": 2,
      "checkInTimestamps": [
        "2024-01-15T09:00:00.000Z",
        "2024-01-15T13:30:00.000Z",
        "2024-01-15T15:00:00.000Z"
      ],
      "checkOutTimestamps": [
        "2024-01-15T12:00:00.000Z",
        "2024-01-15T18:00:00.000Z"
      ],
      "user": {
        "id": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  ]
}
```

---

## 2. Multiple Check-Ins (Updated API)

अब एक दिन में multiple check-ins कर सकते हैं!

### 2.1 First Check-In (पहली बार check-in)

```bash
curl -X POST http://103.14.120.163:8092/api/attendance/check-in \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "notes": "Morning check-in",
    "latitude": 28.7041,
    "longitude": 77.1025,
    "deviceInfo": "iPhone 14 Pro"
  }'
```

### 2.2 Second Check-In (दूसरी बार check-in - same day)

```bash
curl -X POST http://103.14.120.163:8092/api/attendance/check-in \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "notes": "After lunch check-in",
    "latitude": 28.7041,
    "longitude": 77.1025,
    "deviceInfo": "iPhone 14 Pro"
  }'
```

### 2.3 Third Check-In (तीसरी बार check-in - different location)

```bash
curl -X POST http://103.14.120.163:8092/api/attendance/check-in \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "notes": "Evening check-in from different location",
    "latitude": 22.3072,
    "longitude": 73.1812,
    "deviceInfo": "iPhone 14 Pro"
  }'
```

### 2.4 Simple Check-In (बिना location के)

```bash
curl -X POST http://103.14.120.163:8092/api/attendance/check-in \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "notes": "Simple check-in"
  }'
```

### Expected Response

```json
{
  "success": true,
  "data": {
    "id": "attendance_record_id",
    "eventId": "event_id",
    "checkInAt": "2024-01-15T13:30:00.000Z",
    "status": "present",
    "notes": "After lunch check-in",
    "totalCheckInsToday": 2
  }
}
```

---

## 3. Multiple Check-Outs (Updated API)

अब एक दिन में multiple check-outs कर सकते हैं और location भी send कर सकते हैं!

### 3.1 First Check-Out (पहली बार check-out)

```bash
curl -X POST http://103.14.120.163:8092/api/attendance/check-out \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "notes": "Lunch break",
    "latitude": 28.7041,
    "longitude": 77.1025,
    "deviceInfo": "iPhone 14 Pro"
  }'
```

### 3.2 Second Check-Out (दूसरी बार check-out - same day)

```bash
curl -X POST http://103.14.120.163:8092/api/attendance/check-out \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "notes": "End of day",
    "latitude": 28.7041,
    "longitude": 77.1025,
    "deviceInfo": "iPhone 14 Pro"
  }'
```

### 3.3 Check-Out from Different Location

```bash
curl -X POST http://103.14.120.163:8092/api/attendance/check-out \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "notes": "Check-out from field location",
    "latitude": 22.3072,
    "longitude": 73.1812,
    "deviceInfo": "Android Phone"
  }'
```

### 3.4 Simple Check-Out (बिना location के)

```bash
curl -X POST http://103.14.120.163:8092/api/attendance/check-out \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "notes": "Simple check-out"
  }'
```

### Expected Response

```json
{
  "success": true,
  "data": {
    "eventId": "event_id",
    "checkOutAt": "2024-01-15T18:00:00.000Z",
    "checkInAt": "2024-01-15T09:00:00.000Z",
    "workDurationMinutes": 540,
    "totalCheckOutsToday": 2
  }
}
```

---

## 4. Complete Example Workflow

एक complete example जो दिखाता है कि कैसे multiple check-ins/check-outs करें और फिर counts देखें:

### Step 1: First Check-In (9:00 AM)

```bash
curl -X POST http://103.14.120.163:8092/api/attendance/check-in \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "notes": "Morning office check-in",
    "latitude": 28.7041,
    "longitude": 77.1025,
    "deviceInfo": "iPhone 14 Pro"
  }'
```

### Step 2: First Check-Out (12:00 PM - Lunch)

```bash
curl -X POST http://103.14.120.163:8092/api/attendance/check-out \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "notes": "Lunch break",
    "latitude": 28.7041,
    "longitude": 77.1025,
    "deviceInfo": "iPhone 14 Pro"
  }'
```

### Step 3: Second Check-In (1:30 PM - After Lunch)

```bash
curl -X POST http://103.14.120.163:8092/api/attendance/check-in \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "notes": "After lunch check-in",
    "latitude": 28.7041,
    "longitude": 77.1025,
    "deviceInfo": "iPhone 14 Pro"
  }'
```

### Step 4: Third Check-In (3:00 PM - Different Location)

```bash
curl -X POST http://103.14.120.163:8092/api/attendance/check-in \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "notes": "Field visit check-in",
    "latitude": 22.3072,
    "longitude": 73.1812,
    "deviceInfo": "iPhone 14 Pro"
  }'
```

### Step 5: Second Check-Out (6:00 PM - End of Day)

```bash
curl -X POST http://103.14.120.163:8092/api/attendance/check-out \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "notes": "End of day",
    "latitude": 28.7041,
    "longitude": 77.1025,
    "deviceInfo": "iPhone 14 Pro"
  }'
```

### Step 6: Get Counts (Counts देखें)

```bash
curl -X GET "http://103.14.120.163:8092/api/attendance/counts" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

### Expected Counts Response

```json
{
  "success": true,
  "data": [
    {
      "date": "2024-01-15T00:00:00.000Z",
      "location": {
        "latitude": 28.7041,
        "longitude": 77.1025
      },
      "checkIns": 2,
      "checkOuts": 2,
      "checkInTimestamps": [
        "2024-01-15T09:00:00.000Z",
        "2024-01-15T13:30:00.000Z"
      ],
      "checkOutTimestamps": [
        "2024-01-15T12:00:00.000Z",
        "2024-01-15T18:00:00.000Z"
      ],
      "user": {
        "id": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "email": "john@example.com"
      }
    },
    {
      "date": "2024-01-15T00:00:00.000Z",
      "location": {
        "latitude": 22.3072,
        "longitude": 73.1812
      },
      "checkIns": 1,
      "checkOuts": 0,
      "checkInTimestamps": [
        "2024-01-15T15:00:00.000Z"
      ],
      "checkOutTimestamps": [],
      "user": {
        "id": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  ]
}
```

---

## 🔑 Key Points (महत्वपूर्ण बातें)

### ✅ What Changed (क्या बदला)

1. **Multiple Check-Ins**: अब एक दिन में multiple check-ins कर सकते हैं
2. **Multiple Check-Outs**: अब एक दिन में multiple check-outs कर सकते हैं
3. **Location in Check-Out**: Check-out में भी location send कर सकते हैं
4. **Counts API**: नया API जो counts दिखाता है location-wise

### 📊 Counts API Features

- **Date-wise**: Specific date या date range
- **Location-wise**: Same location के events group होते हैं
- **User-wise**: Specific user के लिए filter कर सकते हैं
- **Timestamps**: सभी check-in/check-out timestamps available हैं

### 🔐 Permissions

- **Employee**: सिर्फ अपना data
- **Manager**: अपना + team members का data
- **Admin**: सभी users का data

---

## 🚀 Quick Test Commands

### Test 1: Check-In और Counts देखें

```bash
# 1. Check-in करें
curl -X POST http://103.14.120.163:8092/api/attendance/check-in \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"latitude": 28.7041, "longitude": 77.1025}'

# 2. Counts देखें
curl -X GET "http://103.14.120.163:8092/api/attendance/counts" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test 2: Multiple Check-Ins

```bash
# First check-in
curl -X POST http://103.14.120.163:8092/api/attendance/check-in \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"notes": "First", "latitude": 28.7041, "longitude": 77.1025}'

# Second check-in (same day, same location)
curl -X POST http://103.14.120.163:8092/api/attendance/check-in \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"notes": "Second", "latitude": 28.7041, "longitude": 77.1025}'

# Third check-in (same day, different location)
curl -X POST http://103.14.120.163:8092/api/attendance/check-in \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"notes": "Third", "latitude": 22.3072, "longitude": 73.1812}'

# Counts देखें - 2 locations दिखेंगी
curl -X GET "http://103.14.120.163:8092/api/attendance/counts" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📝 Notes

1. **Token Required**: सभी APIs के लिए Bearer token जरूरी है
2. **Location Optional**: Location optional है, लेकिन अगर देंगे तो better grouping होगी
3. **Date Format**: ISO date format use करें (2024-01-15T00:00:00Z)
4. **Multiple Events**: अब एक दिन में unlimited check-ins/check-outs कर सकते हैं

---

## 🔗 Related APIs

- `GET /api/attendance` - All attendance records
- `GET /api/attendance/summary` - Summary statistics
- `POST /api/attendance/check-in` - Check-in (updated)
- `POST /api/attendance/check-out` - Check-out (updated)
- `GET /api/attendance/counts` - **NEW** - Counts per day per location

---

## 💡 Example Use Cases

### Use Case 1: Field Employee
Employee एक दिन में कई locations visit करता है:
- Office check-in (9 AM)
- Client location check-in (11 AM)
- Office check-out (1 PM)
- Office check-in (2 PM)
- Office check-out (6 PM)

सभी events track होंगे और counts API में location-wise दिखेंगे।

### Use Case 2: Multiple Breaks
Employee lunch और tea breaks के लिए check-out/in करता है:
- Morning check-in
- Lunch check-out
- After lunch check-in
- Tea break check-out
- After tea check-in
- End of day check-out

सभी events separately track होंगे।

---

**Happy Coding! 🎉**

