# Profile Management APIs Documentation

Base URL: `http://103.14.120.163:8092/api`

## 📋 Table of Contents
- [Profile Management APIs](#1️⃣-profile-management-apis)
- [Emergency Contact APIs](#2️⃣-emergency-contact-apis)
- [Bank Details APIs](#3️⃣-bank-details-apis)
- [Settings & Preferences APIs](#4️⃣-settings--preferences-apis)
- [Data Export API](#5️⃣-data-export-api)
- [Work Information APIs](#6️⃣-work-information-apis)
- [Additional APIs](#7️⃣-additional-apis)

---

## 1️⃣ Profile Management APIs

### 1. GET `/user/profile/:userId`
**Description:** Fetch complete user profile

**Headers:**
```
Cookie: attendance_token=<JWT_TOKEN>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "userId123",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+91 98765 43210",
    "dob": "1990-05-15",
    "gender": "Male",
    "bloodGroup": "O+",
    "address": "123 Main St, City",
    "department": "Engineering",
    "designation": "Senior Developer",
    "role": "employee",
    "employeeType": "Full-time",
    "manager": {
      "name": "Manager Name",
      "email": "manager@example.com"
    },
    "joinDate": "2019-01-15",
    "workLocation": "Mumbai Office",
    "shiftTiming": "9:00 AM - 6:00 PM",
    "team": "Frontend Team",
    "status": "active",
    "profilePicture": "/uploads/profile/...",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

**Permissions:**
- Users can view their own profile
- Managers can view their team members' profiles
- Admins can view all profiles

---

### 2. PUT `/user/profile/:userId`
**Description:** Update user profile

**Headers:**
```
Content-Type: application/json
Cookie: attendance_token=<JWT_TOKEN>
```

**Body:**
```json
{
  "name": "John Doe",
  "phone": "+91 98765 43210",
  "dob": "1990-05-15",
  "gender": "Male",
  "bloodGroup": "O+",
  "address": "123 Main St, City",
  "department": "Engineering",
  "designation": "Senior Developer",
  "role": "employee",
  "employeeType": "Full-time",
  "joinDate": "2019-01-15",
  "workLocation": "Mumbai Office",
  "shiftTiming": "9:00 AM - 6:00 PM",
  "team": "Frontend Team"
}
```

**Response:**
```json
{
  "success": true,
  "data": { ... } // Updated profile
}
```

**Permissions:**
- Users can update: name, phone, dob, gender, bloodGroup, address
- Managers/Admins can additionally update: department, designation, role, employeeType, joinDate, workLocation, shiftTiming, team, status, manager

---

### 3. GET `/user/stats/:userId`
**Description:** Get user statistics (real data)

**Response:**
```json
{
  "success": true,
  "data": {
    "yearsWithCompany": 3.2,
    "attendanceRate": 95.5,
    "avgDailyHours": 8.2,
    "performanceRating": 4.5
  }
}
```

**Calculations:**
- `yearsWithCompany`: Calculated from joinDate
- `attendanceRate`: Based on last 90 days attendance records
- `avgDailyHours`: Average work duration from attendance records
- `performanceRating`: Placeholder (4.5)

---

## 2️⃣ Emergency Contact APIs

### 4. GET `/user/emergency-contact/:userId`
**Description:** Fetch emergency contact details

**Response:**
```json
{
  "success": true,
  "data": {
    "contactName": "Jane Doe",
    "relationship": "Spouse",
    "phone": "+91 98765 00000",
    "address": "123 Main St"
  }
}
```

**Note:** Returns `null` if no emergency contact is set.

---

### 5. PUT `/user/emergency-contact/:userId`
**Description:** Create/Update emergency contact

**Body:**
```json
{
  "contactName": "Jane Doe",
  "relationship": "Spouse",
  "phone": "+91 98765 00000",
  "address": "123 Main St"
}
```

**Required Fields:** `contactName`, `relationship`, `phone`

**Permissions:** User themselves or Admin only

---

## 3️⃣ Bank Details APIs

### 6. GET `/user/bank-details/:userId`
**Description:** Fetch bank details

**Response:**
```json
{
  "success": true,
  "data": {
    "bankName": "HDFC Bank",
    "accountNumber": "1234567890",
    "ifscCode": "HDFC0001234",
    "branch": "Mumbai Main"
  }
}
```

**Permissions:** User themselves or Admin only (sensitive data)

---

### 7. PUT `/user/bank-details/:userId`
**Description:** Create/Update bank details

**Body:**
```json
{
  "bankName": "HDFC Bank",
  "accountNumber": "1234567890",
  "ifscCode": "HDFC0001234",
  "branch": "Mumbai Main"
}
```

**Required Fields:** `bankName`, `accountNumber`, `ifscCode`

**Note:** IFSC code is automatically converted to uppercase

---

## 4️⃣ Settings & Preferences APIs

### 8. GET `/user/preferences/:userId`
**Description:** Fetch user preferences

**Response:**
```json
{
  "success": true,
  "data": {
    "notifications": {
      "email": true,
      "push": true,
      "sms": false
    },
    "language": "en",
    "theme": "dark"
  }
}
```

**Note:** Auto-creates default preferences if none exist

**Permissions:** User themselves only

---

### 9. PUT `/user/preferences/:userId`
**Description:** Update user preferences

**Body:**
```json
{
  "notifications": {
    "email": true,
    "push": false,
    "sms": true
  },
  "language": "hi",
  "theme": "light"
}
```

**Theme Options:** `"light"`, `"dark"`, `"system"`

---

### 10. POST `/user/change-password`
**Description:** Change user password

**Body:**
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Validations:**
- Current password must be correct
- New password must be at least 6 characters

---

## 5️⃣ Data Export API

### 11. POST `/user/export-data/:userId`
**Description:** Export user data

**Body:**
```json
{
  "dataTypes": ["personal", "attendance", "leave", "performance"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "exportedAt": "2025-12-13T06:30:00.000Z",
    "userId": "userId123",
    "personal": { ... },
    "attendance": { ... },
    "leave": { ... },
    "performance": { ... }
  }
}
```

**Available Data Types:**
- `personal`: Profile, emergency contact, bank details, preferences
- `attendance`: Last 90 days of attendance records
- `leave`: All leave requests
- `performance`: Performance reviews (placeholder)

**Permissions:** User themselves or Admin only

---

## 6️⃣ Work Information APIs

### 12. GET `/user/work-info/:userId`
**Description:** Get complete work information

**Response:**
```json
{
  "success": true,
  "data": {
    "department": "Engineering",
    "designation": "Senior Developer",
    "role": "employee",
    "employeeType": "Full-time",
    "managerId": "managerId456",
    "managerName": "Manager Name",
    "managerEmail": "manager@example.com",
    "managerPhone": "+91 98765 11111",
    "managerDesignation": "Engineering Manager",
    "joinDate": "2019-01-15",
    "workLocation": "Mumbai Office",
    "shiftTiming": "9:00 AM - 6:00 PM",
    "team": "Frontend Team"
  }
}
```

---

### 13. GET `/user/manager/:managerId`
**Description:** Fetch manager details

**Response:**
```json
{
  "success": true,
  "data": {
    "name": "Manager Name",
    "email": "manager@example.com",
    "phone": "+91 98765 11111",
    "designation": "Engineering Manager",
    "department": "Engineering"
  }
}
```

**Note:** Validates that the user is actually a manager/admin

---

## 7️⃣ Additional APIs

### 14. GET `/user/attendance-summary/:userId`
**Description:** Get attendance statistics

**Query Parameters:**
- `startDate`: ISO date string (optional, defaults to 30 days ago)
- `endDate`: ISO date string (optional, defaults to today)

**Example:**
```
GET /user/attendance-summary/:userId?startDate=2025-01-01&endDate=2025-01-31
```

**Response:**
```json
{
  "success": true,
  "data": {
    "startDate": "2025-01-01",
    "endDate": "2025-01-31",
    "totalDays": 25,
    "presentDays": 22,
    "halfDays": 1,
    "absentDays": 1,
    "onLeaveDays": 1,
    "avgHours": 8.2,
    "lateCount": 3
  }
}
```

---

### 15. POST `/user/profile-picture/:userId`
**Description:** Upload profile picture

**Headers:**
```
Content-Type: multipart/form-data
```

**Body:**
- `file`: Image file (JPG, PNG, WebP)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "userId123",
    "profilePicture": "/uploads/profile/userId123.jpg",
    "message": "Profile picture uploaded successfully"
  }
}
```

**Note:** Existing picture is automatically deleted

**Permissions:** User themselves or Admin

---

### 16. DELETE `/user/profile-picture/:userId`
**Description:** Delete profile picture

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "userId123",
    "message": "Profile picture deleted successfully"
  }
}
```

---

## 🔐 Authentication

All APIs require authentication via JWT token stored in cookies.

**Cookie Name:** `attendance_token`

**Obtain Token:**
```
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

---

## 🚨 Error Response Format

```json
{
  "success": false,
  "error": "Error message here"
}
```

**Common HTTP Status Codes:**
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error)
- `401`: Unauthorized (not logged in)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `409`: Conflict (e.g., duplicate email)
- `500`: Internal Server Error

---

## 📝 Notes

### Role-Based Access Control

**Admin:**
- Full access to all users' data
- Can modify all profile fields

**Manager:**
- Can view/edit team members (employees only)
- Can modify work-related fields for team members

**Employee:**
- Can view/edit own profile
- Limited fields for personal updates

### Data Models

**New Models Created:**
1. `EmergencyContact` - One per user
2. `BankDetails` - One per user
3. `UserPreferences` - One per user

**Updated Model:**
- `User` - Extended with personal and work information fields

---

## 🎯 Priority Implementation Status

✅ **High Priority (Completed):**
- GET `/user/profile/:userId`
- PUT `/user/profile/:userId`
- GET `/user/stats/:userId`
- POST `/user/change-password`

✅ **Medium Priority (Completed):**
- GET/PUT `/user/emergency-contact/:userId`
- GET/PUT `/user/bank-details/:userId`
- GET `/user/work-info/:userId`

✅ **Low Priority (Completed):**
- GET/PUT `/user/preferences/:userId`
- POST `/user/export-data/:userId`
- GET `/user/manager/:managerId`
- GET `/user/attendance-summary/:userId`
- POST/DELETE `/user/profile-picture/:userId`

---

## 🧪 Testing

You can test these APIs using tools like:
- **Postman** or **Insomnia**
- **cURL** commands
- **Your Flutter app**

### Example cURL:
```bash
# Login first to get token
curl -X POST http://103.14.120.163:8092/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}' \
  -c cookies.txt

# Get user profile
curl -X GET http://103.14.120.163:8092/api/user/profile/{userId} \
  -b cookies.txt
```

---

**Created:** 2025-12-13  
**Version:** 1.0  
**Base URL:** `http://103.14.120.163:8092/api`
