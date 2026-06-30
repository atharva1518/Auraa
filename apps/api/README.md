# Aura Backend - Milestone 2

## Overview
This is the backend for Aura, built with FastAPI. It follows a modular architecture where different domains (auth, student, parent, admin, ai) are cleanly separated into their own modules under `app/`.

## Architecture
- **`main.py`**: The entry point for the FastAPI application. Configures CORS and registers the global `gateway` router.
- **`app/gateway/`**: Central hub router that registers all sub-module routers and exposes a global `/health` endpoint.
- **Modules (`auth`, `student`, `parent`, `admin`, `ai`)**: Each module has its own `routes.py` (which defines endpoints thinly) and `service.py` (where business logic resides).
- **Placeholders**: `models.py`, `repository.py`, and `schemas.py` are preserved within modules for future expansion.

## Running Locally

1. **Prerequisites**: Python 3.11+
2. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
3. **Configure Environment**:
   Create a `.env` file in the root directory based on `.env.example`.
   ```env
   FIREBASE_PROJECT_ID=your_firebase_project_id
   FIREBASE_CREDENTIALS_PATH=./path/to/firebase-credentials.json
   ```
4. **Start the Server**:
   ```bash
   python -m uvicorn main:app --reload
   ```
5. **Access the API Docs**:
   Navigate to `http://localhost:8000/docs` in your browser.

## Database Migrations (Alembic)
The project uses SQLAlchemy and Alembic for database management. Supabase PostgreSQL is the intended host.

**To initialize the database:**
1. Configure `DATABASE_URL` in your `.env` file (e.g., `postgresql+psycopg://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres`).
2. Run migrations to upgrade the schema:
   ```bash
   alembic upgrade head
   ```

**To generate a new migration after modifying models:**
```bash
alembic revision --autogenerate -m "description_of_changes"
```

**To rollback the last migration:**
```bash
alembic downgrade -1
```

## Firebase Authentication

The authentication module relies on the official Firebase Admin SDK.
It supports **Google Authentication** and **Phone Number (SMS OTP)** flows.

The backend acts purely as an identity verifier:
1. The frontend authenticates directly with Firebase.
2. The frontend sends the resulting Firebase ID Token to the `POST /auth/login` endpoint.
3. The backend securely verifies the token and returns the normalized Aura user profile.
