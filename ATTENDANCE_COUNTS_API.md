# Attendance Counts API - Check-In/Check-Out Counts per Day and Location

**Base URL:** `http://103.14.120.163:8092` (Production) या `http://localhost:3000` (Local)  
**Authentication:** Bearer Token (required)

---

## Overview

यह API आपको दिखाता है कि एक दिन में कितनी बार check-in और check-out किया गया है, location-wise breakdown के साथ।

**Example:** अगर एक user ने एक दिन में 3 बार check-in किया है एक location से, तो API यह दिखाएगा:
- Date: 2024-01-15
- Location: { latitude: 28.7041, longitude: 77.1025 }
- Check-ins: 3
- Check-outs: 2

---

## Endpoint

**GET** `/api/attendance/counts`

---

## Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `date` | string (ISO date) | No | Specific date (default: today) |
| `startDate` | string (ISO date) | No | Start date for range |
| `endDate` | string (ISO date) | No | End date for range |
| `userId` | string | No | Specific user ID (admin/manager only) |

---

## Examples

### 1. Today's Counts (आज के counts)

```bash
curl -X GET "http://103.14.120.163:8092/api/attendance/counts" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 2. Specific Date (किसी specific date के लिए)

```bash
curl -X GET "http://103.14.120.163:8092/api/attendance/counts?date=2024-01-15T00:00:00Z" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 3. Date Range (Date range के लिए)

```bash
curl -X GET "http://103.14.120.163:8092/api/attendance/counts?startDate=2024-01-01T00:00:00Z&endDate=2024-01-31T23:59:59Z" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 4. Specific User (किसी specific user के लिए - Admin/Manager only)

```bash
curl -X GET "http://103.14.120.163:8092/api/attendance/counts?userId=USER_ID_HERE" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 5. Local Server

```bash
curl -X GET "http://localhost:3000/api/attendance/counts?date=2024-01-15T00:00:00Z" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Response Format

### Success Response (200)

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
    },
    {
      "date": "2024-01-15T00:00:00.000Z",
      "location": null,
      "checkIns": 1,
      "checkOuts": 1,
      "checkInTimestamps": [
        "2024-01-15T10:00:00.000Z"
      ],
      "checkOutTimestamps": [
        "2024-01-15T17:00:00.000Z"
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

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `date` | string (ISO date) | Date of attendance |
| `location` | object \| null | Location coordinates (if available) |
| `location.latitude` | number | Latitude |
| `location.longitude` | number | Longitude |
| `checkIns` | number | Number of check-ins on this date from this location |
| `checkOuts` | number | Number of check-outs on this date from this location |
| `checkInTimestamps` | array | Array of all check-in timestamps |
| `checkOutTimestamps` | array | Array of all check-out timestamps |
| `user` | object | User information |
| `user.id` | string | User ID |
| `user.name` | string | User name |
| `user.email` | string | User email |

---

## Multiple Check-Ins/Check-Outs

अब system multiple check-ins और check-outs support करता है:

### Before (पहले):
- एक दिन में सिर्फ एक बार check-in
- एक दिन में सिर्फ एक बार check-out

### Now (अब):
- एक दिन में multiple check-ins allowed
- एक दिन में multiple check-outs allowed
- हर check-in/check-out event separately track होता है
- Location-wise grouping available

---

## Updated Check-In/Check-Out APIs

### Check-In API (Updated)

अब multiple check-ins allow करता है:

```bash
curl -X POST http://103.14.120.163:8092/api/attendance/check-in \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "notes": "Second check-in of the day",
    "latitude": 28.7041,
    "longitude": 77.1025,
    "deviceInfo": "iPhone 14 Pro"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "attendance_record_id",
    "eventId": "event_id",
    "checkInAt": "2024-01-15T13:30:00.000Z",
    "status": "present",
    "notes": "Second check-in of the day",
    "totalCheckInsToday": 2
  }
}
```

### Check-Out API (Updated)

अब multiple check-outs allow करता है और location support करता है:

```bash
curl -X POST http://103.14.120.163:8092/api/attendance/check-out \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "notes": "First check-out",
    "latitude": 28.7041,
    "longitude": 77.1025,
    "deviceInfo": "iPhone 14 Pro"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "eventId": "event_id",
    "checkOutAt": "2024-01-15T12:00:00.000Z",
    "checkInAt": "2024-01-15T09:00:00.000Z",
    "workDurationMinutes": 180,
    "totalCheckOutsToday": 1
  }
}
```

---

## Use Cases

### 1. Track Multiple Office Visits
अगर employee एक दिन में कई बार office आता-जाता है, तो सभी visits track हो जाएंगी।

### 2. Location-Based Tracking
अलग-अलग locations से check-in/check-out करने पर separate entries मिलेंगी।

### 3. Daily Summary
एक दिन में कुल कितनी बार check-in/check-out हुआ, यह easily देख सकते हैं।

---

## Permissions

- **Employee:** सिर्फ अपना data देख सकता है
- **Manager:** अपना और अपने team members का data देख सकता है
- **Admin:** सभी users का data देख सकता है

---

## Error Responses

### Unauthorized (401)
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

### Invalid User ID (400)
```json
{
  "success": false,
  "message": "Invalid user id"
}
```

---

## Notes

1. **Location Grouping:** Same location से multiple check-ins एक group में दिखेंगे
2. **No Location:** अगर location नहीं दी गई, तो `location: null` होगा और सभी no-location events एक group में होंगे
3. **Timestamps:** सभी check-in और check-out timestamps array में available हैं
4. **Backward Compatibility:** पुराना Attendance model भी maintain हो रहा है, लेकिन अब events separately track हो रहे हैं

---

## Example Scenario

**Scenario:** Employee ने एक दिन में 3 बार check-in किया:
1. 9:00 AM - Office location (28.7041, 77.1025)
2. 1:30 PM - Same office location (28.7041, 77.1025)
3. 3:00 PM - Different location (22.3072, 73.1812)

**API Response:**
```json
{
  "success": true,
  "data": [
    {
      "date": "2024-01-15T00:00:00.000Z",
      "location": { "latitude": 28.7041, "longitude": 77.1025 },
      "checkIns": 2,
      "checkOuts": 1,
      "checkInTimestamps": [
        "2024-01-15T09:00:00.000Z",
        "2024-01-15T13:30:00.000Z"
      ],
      "user": { "name": "John Doe", "email": "john@example.com" }
    },
    {
      "date": "2024-01-15T00:00:00.000Z",
      "location": { "latitude": 22.3072, "longitude": 73.1812 },
      "checkIns": 1,
      "checkOuts": 0,
      "checkInTimestamps": [
        "2024-01-15T15:00:00.000Z"
      ],
      "user": { "name": "John Doe", "email": "john@example.com" }
    }
  ]
}
```

---

## Quick Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/attendance/counts` | Get check-in/check-out counts per day per location |
| POST | `/api/attendance/check-in` | Check-in (now supports multiple per day) |
| POST | `/api/attendance/check-out` | Check-out (now supports multiple per day with location) |

