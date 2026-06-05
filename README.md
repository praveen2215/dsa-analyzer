# DSA Analyzer

> A professional LeetCode analytics dashboard for tracking your coding journey

Live Demo: https://dsa-analyzer-pearl.vercel.app

## Features
- User authentication with persistent PostgreSQL database
- Real LeetCode data via GraphQL API
- Topic mastery heatmap with weighted scoring
- Contest rating progression charts
- Interview readiness score
- Skill gap analyzer for Google, Meta, Amazon, Microsoft, Apple, Netflix
- Daily challenge tracker with streak counter
- Goal tracker weekly and monthly with auto reset
- Global rank tracker with percentile
- AI study plan based on weak topics
- Progress timeline from real activity data
- Shareable profile links
- Multi user isolation

## Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Chart.js |
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| Auth | Session-based with bcrypt |
| Deployment | Vercel (frontend) + Render (backend) |

## Run Locally

### Backend
```bash
cd backend
npm install
node server.js
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```
