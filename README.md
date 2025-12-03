# Baby Meal Tracker — Feeding Module

**Contributor:** Hamza Shakur  
**EUID:** HKS0062  
**Course:** CSCE 3444 — Software Engineering  
**Project Group:** 13  
**Feature:** Feeding Module (Backend + Frontend)

---

This module implements the Feeding Log functionality for the Baby Meal Tracker project.  
It provides backend APIs (Node/Express/Prisma) and a frontend React component to record, view, and manage infant feeding sessions.


## Backend quick start
```
cd backend
npm install
cp .env.example .env
npx prisma migrate dev --name init_feeding
npm run dev
```
API: http://localhost:4000

## Frontend usage
Copy `frontend/FeedingLog.tsx` into your app (e.g., `src/components/`) and render:
```tsx
import FeedingLog from "@/components/FeedingLog";
export default function Page(){ 
  return <FeedingLog apiBase={import.meta.env.VITE_API_BASE ?? "http://localhost:4000"} /> 
}
```
## API Structure

### Sign Up
```
POST /api/signup
```
```json
{
  "email": "string",
  "password": "string",
  "baby_name": "string"
}
```
Response:
```json
{
  "message": "Account created",
  "user_id": 1
}
```

### Login
```
POST /api/login
```
```json
{
  "email": "string",
  "password": "string"
}
```
Response:
```json
{
  "token": "JWT_TOKEN"
}
```

### User Info
```
GET /api/users/me
```
Headers:
```
  Authorization: Bearer <token>
```

Response:
```json
{
  "id": 1,
  "email": "string",
  "baby_name": "string",
  "created_at": "2025-01-01"
}
```
### Get Feedings
```
GET /api/feedings
```
Headers:
```
  Authorization: Bearer <token>
```
### Add Feeding
```
POST /api/feedings
```
```json
{
  "amount": "4oz",
  "type": "bottle" , "breast" , "solid",
  "timestamp": "2025-01-01T14:00:00",
  "notes": "Baby was sleepy"
}
```
### Update Feeding
```
PUT /api/feedings/:id
```
### Delete Feeding
```
DELETE /api/feedings/:id
```
### Get Reminders
```
GET /api/reminders
```
### Create Reminder
```
POST /api/reminders
```
```json
{
  "reminder_time": "18:00",
  "repeat": "daily"
}
```
### Update Reminder
```
PUT /api/reminders/:id
```
### Delete Reminder
```
DELETE /api/reminders/:id
```


