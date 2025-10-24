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
