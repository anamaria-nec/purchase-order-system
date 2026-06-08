# PO Management System

A web application for managing Purchase Orders with a multi-stage approval workflow.

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python 3.11 + FastAPI |
| Database | PostgreSQL + SQLAlchemy |
| Frontend | Next.js 16 + TypeScript + Tailwind CSS |
| Auth | JWT (JSON Web Token) |

## Features

- Role-based access control (Creator, Manager, IT Representative, Finance)
- Multi-stage PO approval workflow
- Automatic routing based on amount and category
- Rejection and rework loop

## Getting Started

### Prerequisites
- Python 3.11
- Node.js 18
- PostgreSQL

### Backend

```bash
cd backend
uv run uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Seed test users

```bash
cd backend
uv run python seed.py
```

## Environment Variables

**Backend** (`backend/.env`):
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/po_management
SECRET_KEY=your-secret-key
```

**Frontend** (`frontend/.env.local`):
```
API_URL=http://localhost:8000
```

## API Documentation

Available at `http://localhost:8000/docs` when the backend is running.