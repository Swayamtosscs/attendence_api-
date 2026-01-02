# GET Counts API - Data Examples (कैसा Data मिलेगा)

**Endpoint:** `GET /api/attendance/counts`

---

## 📊 Response Data Structure

जब आप GET API call करेंगे, तो आपको यह data मिलेगा:

### Basic Response Format

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

## 📋 Field Explanation (हर Field का मतलब)

| Field | Type | Description |
|-------|------|-------------|
| `date` | string | Date जिस दिन check-in/check-out हुआ |
| `location` | object \| null | Location coordinates (अगर available है) |
| `location.latitude` | number | Latitude |
| `location.longitude` | number | Longitude |
| `checkIns` | number | **कितनी बार check-in हुआ** (यही main count है) |
| `checkOuts` | number | **कितनी बार check-out हुआ** (यही main count है) |
| `checkInTimestamps` | array | सभी check-in के exact timestamps |
| `checkOutTimestamps` | array | सभी check-out के exact timestamps |
| `user` | object | User की information |
| `user.id` | string | User ID |
| `user.name` | string | User का name |
| `user.email` | string | User का email |

---

## 🎯 Real Examples

### Example 1: Ek Din Mein 3 Baar Check-In (Same Location)

**Scenario:** Employee ने एक दिन में 3 बार check-in किया same location से

**API Call:**
```bash
curl -X GET "http://103.14.120.163:8092/api/attendance/counts?date=2024-01-15T00:00:00Z" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
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
      "checkIns": 3,          // ← यहाँ 3 दिखेगा
      "checkOuts": 2,
      "checkInTimestamps": [
        "2024-01-15T09:00:00.000Z",   // 9 AM
        "2024-01-15T13:30:00.000Z",   // 1:30 PM
        "2024-01-15T15:00:00.000Z"    // 3 PM
      ],
      "checkOutTimestamps": [
        "2024-01-15T12:00:00.000Z",   // 12 PM
        "2024-01-15T18:00:00.000Z"    // 6 PM
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

**Explanation:**
- `checkIns: 3` = 3 बार check-in हुआ
- `checkOuts: 2` = 2 बार check-out हुआ
- सभी timestamps array में available हैं

---

### Example 2: Multiple Locations (Alag-Alag Locations)

**Scenario:** Employee ने 2 अलग locations से check-in किया

**Response:**
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
      "checkIns": 2,          // Location 1 से 2 बार
      "checkOuts": 1,
      "checkInTimestamps": [
        "2024-01-15T09:00:00.000Z",
        "2024-01-15T13:30:00.000Z"
      ],
      "checkOutTimestamps": [
        "2024-01-15T12:00:00.000Z"
      ],
      "user": {
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
      "checkIns": 1,          // Location 2 से 1 बार
      "checkOuts": 0,
      "checkInTimestamps": [
        "2024-01-15T15:00:00.000Z"
      ],
      "checkOutTimestamps": [],
      "user": {
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  ]
}
```

**Explanation:**
- Location 1 (28.7041, 77.1025): 2 check-ins, 1 check-out
- Location 2 (22.3072, 73.1812): 1 check-in, 0 check-out
- Total: 3 check-ins, 1 check-out

---

### Example 3: No Location (Location नहीं दी)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "date": "2024-01-15T00:00:00.000Z",
      "location": null,        // ← Location null है
      "checkIns": 2,
      "checkOuts": 1,
      "checkInTimestamps": [
        "2024-01-15T09:00:00.000Z",
        "2024-01-15T14:00:00.000Z"
      ],
      "checkOutTimestamps": [
        "2024-01-15T18:00:00.000Z"
      ],
      "user": {
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  ]
}
```

---

### Example 4: Multiple Users (Manager/Admin View)

**Response:**
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
      "location": {
        "latitude": 28.7041,
        "longitude": 77.1025
      },
      "checkIns": 1,
      "checkOuts": 1,
      "checkInTimestamps": [
        "2024-01-15T10:00:00.000Z"
      ],
      "checkOutTimestamps": [
        "2024-01-15T17:00:00.000Z"
      ],
      "user": {
        "id": "507f1f77bcf86cd799439012",
        "name": "Jane Smith",
        "email": "jane@example.com"
      }
    }
  ]
}
```

---

## 🔍 Key Points (महत्वपूर्ण बातें)

### 1. Counts कहाँ देखें?
```json
"checkIns": 3,      // ← यहाँ check-in की count है
"checkOuts": 2      // ← यहाँ check-out की count है
```

### 2. Timestamps कहाँ हैं?
```json
"checkInTimestamps": [     // ← सभी check-in times
  "2024-01-15T09:00:00.000Z",
  "2024-01-15T13:30:00.000Z"
],
"checkOutTimestamps": [    // ← सभी check-out times
  "2024-01-15T12:00:00.000Z"
]
```

### 3. Location-wise Grouping
- Same location के सभी events एक group में होंगे
- Different locations अलग-अलग entries होंगी

### 4. Date Format
- Date ISO format में है: `2024-01-15T00:00:00.000Z`
- Timestamps भी ISO format में हैं

---

## 📱 Practical Usage Examples

### Example 1: Check Karo Kitni Baar Check-In Hua

```bash
# API call
curl -X GET "http://103.14.120.163:8092/api/attendance/counts" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response se check karo:**
```json
{
  "data": [
    {
      "checkIns": 3,    // ← यहाँ 3 दिखेगा अगर 3 बार check-in किया
      "checkOuts": 2
    }
  ]
}
```

### Example 2: Specific Date ke Liye

```bash
curl -X GET "http://103.14.120.163:8092/api/attendance/counts?date=2024-01-15T00:00:00Z" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Example 3: Date Range ke Liye

```bash
curl -X GET "http://103.14.120.163:8092/api/attendance/counts?startDate=2024-01-01T00:00:00Z&endDate=2024-01-31T23:59:59Z" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 💡 Summary

**GET API se yeh data milta hai:**

1. ✅ **checkIns count** - Kitni baar check-in hua
2. ✅ **checkOuts count** - Kitni baar check-out hua
3. ✅ **Timestamps** - Har check-in/check-out ka exact time
4. ✅ **Location** - Kahan se check-in/check-out hua
5. ✅ **User info** - Kis user ka data hai
6. ✅ **Date** - Kis date ka data hai

**Main fields jo aapko chahiye:**
- `checkIns` = Check-in की count
- `checkOuts` = Check-out की count
- `checkInTimestamps` = सभी check-in times
- `checkOutTimestamps` = सभी check-out times

---

## 🚀 Quick Test

```bash
# 1. Pehle check-in karo (2-3 baar)
curl -X POST http://103.14.120.163:8092/api/attendance/check-in \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"latitude": 28.7041, "longitude": 77.1025}'

# 2. Phir counts dekhlo
curl -X GET "http://103.14.120.163:8092/api/attendance/counts" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response mein `checkIns` field mein count dikhegi!** 🎯

