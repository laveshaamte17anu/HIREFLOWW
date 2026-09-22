# HireFlow — Production Full-Stack Recruitment Platform

HireFlow is a complete, modern recruitment and job portal platform built from scratch with Node.js, Express, MongoDB (Mongoose), React (Vite), and Tailwind CSS.

---

## 🚀 Key Features

### 🏢 Recruiter Admin Workspace
- **Job Posting Management**: Create, edit, publish, close, or delete job postings.
- **Data Isolation**: Admins see ONLY applicants for jobs created by them (`createdBy == adminId`).
- **Rule-Based Candidate Match Scoring**: Real-time match percentage calculation comparing candidate skills, education degree, experience level, and location vs job criteria.
- **Applicant Pipeline & Ranking**: Sort and filter applicants by match score, experience, or application date.
- **Interview Scheduler**: Schedule live online/in-person interviews with meeting links and auto-send candidate notifications.
- **CSV Data Export**: Export candidate list for owned jobs to CSV format.
- **Recruitment Analytics**: Real MongoDB reports for shortlist conversion rates, job location distribution, and status breakdowns.

### 👤 Candidate Portal
- **Public Job Search & Filters**: Search jobs by keyword, location, company, job type, experience, skills, and deadline.
- **Application Submission**: Fill out qualifications and upload resumes (PDF/DOC/DOCX up to 5MB via Multer).
- **Application Ownership**: Applications are automatically routed to the Job Owner Admin.
- **Status Progression Timeline**: Track application stages (`Applied` -> `Under Review` -> `Shortlisted` -> `Interview` -> `Selected` / `Rejected`).
- **Saved & Recommended Jobs**: Bookmark jobs and view personalized job recommendations ranked by match score.
- **In-App Notifications**: Real-time notifications for status changes and scheduled interviews.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, React Router DOM v6, Axios, Lucide React, Tailwind CSS
- **Backend**: Node.js, Express.js, MongoDB Atlas (Mongoose), JWT, bcryptjs, Multer, CORS, dotenv

---

## 📂 Project Structure

```text
HireFlow/
│
├── backend/
│   ├── config/db.js
│   ├── controllers/
│   │   ├── analyticsController.js
│   │   ├── applicationController.js
│   │   ├── authController.js
│   │   ├── interviewController.js
│   │   ├── jobController.js
│   │   ├── notificationController.js
│   │   ├── savedJobController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── adminMiddleware.js
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── models/
│   │   ├── Application.js
│   │   ├── Interview.js
│   │   ├── Job.js
│   │   ├── Notification.js
│   │   ├── SavedJob.js
│   │   └── User.js
│   ├── routes/
│   │   ├── analyticsRoutes.js
│   │   ├── applicationRoutes.js
│   │   ├── authRoutes.js
│   │   ├── interviewRoutes.js
│   │   ├── jobRoutes.js
│   │   ├── notificationRoutes.js
│   │   ├── savedJobRoutes.js
│   │   └── userRoutes.js
│   ├── seed/seedAdmin.js
│   ├── utils/matchScore.js
│   ├── uploads/
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## ⚡ Quick Start & Installation

### 1. Environment Setup

Copy `.env.example` in `backend/` to `backend/.env`:
```env
MONGODB_URI=mongodb://127.0.0.1:27017/hireflow
JWT_SECRET=hireflow_super_secret_jwt_key_2026
PORT=5000
CLIENT_URL=http://localhost:5173
ADMIN_EMAIL=admin@hireflow.com
ADMIN_PASSWORD=AdminPassword123!
```

Copy `.env.example` in `frontend/` to `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 2. Backend Setup & Admin Seeding

```bash
cd backend
npm install

# Seed default Admin recruiter account
npm run seed:admin

# Start Express Backend Server
npm start
```

### 3. Frontend Setup

```bash
cd frontend
npm install

# Start Vite Development Server
npm run dev
```

The application will run on `http://localhost:5173`.

---

## 🔐 Default Admin Recruiter Credentials

- **Email**: `admin@hireflow.com`
- **Password**: `AdminPassword123!`

---

## 📡 API Overview

- `POST /api/auth/register` - Candidate registration
- `POST /api/auth/login` - User login (Admin / Candidate)
- `GET /api/auth/me` - Fetch authenticated user profile
- `GET /api/jobs` - Search and filter published jobs
- `POST /api/jobs` - Create new job (Admin only)
- `POST /api/applications` - Submit application with resume upload (Candidate only)
- `GET /api/applications/admin` - Fetch applicants for owned jobs (Admin only)
- `PATCH /api/applications/:id/status` - Update application status (Admin only)
- `POST /api/interviews` - Schedule candidate interview (Admin only)
- `GET /api/analytics/reports` - Aggregate recruitment analytics (Admin only)
- `GET /api/analytics/export-csv` - Export applicants CSV (Admin only)

---

## 📄 License

Built for HireFlow Platform © 2026.
