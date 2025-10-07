# Multi-stage build for frontend + backend
FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM python:3.11-slim
WORKDIR /app
RUN apt-get update && apt-get install -y gcc && rm -rf /var/lib/apt/lists/*
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ ./backend/
COPY --from=frontend-build /app/frontend/dist ./frontend/dist
COPY Assessment.xlsx ./Assessment.xlsx
ENV PYTHONPATH=/app/backend
WORKDIR /app/backend
EXPOSE $PORT
CMD uvicorn main:app --host 0.0.0.0 --port $PORT