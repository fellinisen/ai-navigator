# AI Navigator Assessment

A simple web application for evaluating organizational AI readiness, built with Vue.js (frontend) and FastAPI (backend). Includes Docker support.

## Features
- Interactive questionnaire driven by Excel data (Assessment.xlsx)
- Email results delivery
- Responsive UI with clean design and color palette
- Dockerized deployment

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+

### Development
1. Backend:
   - `cd backend`
   - `pip install -r requirements.txt`
   - `uvicorn main:app --reload --port 8000`
2. Frontend:
   - `cd frontend`
   - `npm install`
   - `npm run serve`

Frontend runs on `http://localhost:3000` and backend on `http://localhost:8000`.

### Docker
- `docker-compose up --build`

## Configuration
Copy `.env.example` to `.env` and fill SMTP credentials for email sending.

## Excel Structure
- Assessment sheet: Questions, optional Option* columns and scores
- Explainer sheet (optional): Explanations for sections

## API
- `GET /questionnaires`
- `GET /questionnaires/{id}`
- `POST /submit-assessment`