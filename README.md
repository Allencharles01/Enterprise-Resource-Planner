<<<<<<< HEAD
# Digital Marketing Dashboard

Standalone full-stack dashboard built with Next.js, Express, MongoDB, Mongoose, Socket.io, Tailwind CSS, Framer Motion, Recharts, and Lucide React.

## Run

1. Start MongoDB locally, or set `MONGO_URI` in `backend/.env`.
2. Install dependencies:

```bash
npm run install:all
```

3. Start the app:
=======
# ERP Project

Welcome to the ERP project! This project is set up as a monorepo containing both the frontend (Next.js) and backend (Node.js/Express) applications.

## Getting Started

Follow these steps to get the project running locally on your machine.

### 1. Install Dependencies
From the root of the project, run the following command to install the dependencies for both the frontend and backend simultaneously:

```bash
npm install
```

### 2. Environment Variables Setup
You will need to set up your local environment variables for both the backend and frontend.

**Backend Setup:**
Navigate to the `backend` folder and copy the example environment file:

*Linux/macOS:*
```bash
cd backend
cp .env.example .env
```

*Windows (Command Prompt / PowerShell):*
```cmd
cd backend
copy .env.example .env
```

Open the newly created `backend/.env` file and replace `"Enter your Mongodb or Mongodb Atlas URI here"` with your actual MongoDB connection string.

**Frontend Setup:**
Navigate to the `frontend` folder and copy the example environment file:

*Linux/macOS:*
```bash
cd ../frontend
cp .env.example .env.local
```

*Windows (Command Prompt / PowerShell):*
```cmd
cd ../frontend
copy .env.example .env.local
```
*(This file already has the correct default URL for your local backend).*

### 3. Run the Application
Navigate back to the root folder of the project (`cd ..`) and run the start script:
>>>>>>> 24ea7a44f9cd1f7fec147b566fc4de1f6a4960d0

```bash
npm run dev
```

<<<<<<< HEAD
Frontend: `http://localhost:3000`

Backend: `http://localhost:5000`

The backend creates the required MongoDB collections on startup without inserting dummy data. All dashboard cards, charts, filters, tables, activities, and modal data are loaded from MongoDB through the backend API. Socket.io emits `dashboardUpdated` after database changes so the frontend refreshes automatically.
=======
This single command will start both the backend API (on port `4001`) and the frontend web app (on port `3001`) concurrently! 

Open [http://localhost:3001](http://localhost:3001) in your browser to view the application.
>>>>>>> 24ea7a44f9cd1f7fec147b566fc4de1f6a4960d0
