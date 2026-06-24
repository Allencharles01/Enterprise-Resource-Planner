# Digital Marketing Dashboard

Standalone full-stack dashboard built with Next.js, Express, MongoDB, Mongoose, Socket.io, Tailwind CSS, Framer Motion, Recharts, and Lucide React.

## Run

1. Start MongoDB locally, or set `MONGO_URI` in `backend/.env`.
2. Install dependencies:

```bash
npm run install:all
```

3. Start the app:

```bash
npm run dev
```

Frontend: `http://localhost:3000`

Backend: `http://localhost:5000`

The backend creates the required MongoDB collections on startup without inserting dummy data. All dashboard cards, charts, filters, tables, activities, and modal data are loaded from MongoDB through the backend API. Socket.io emits `dashboardUpdated` after database changes so the frontend refreshes automatically.
