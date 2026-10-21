import os
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent

dockerfile_api = """FROM python:3.10-slim as builder

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY apps/api/requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

FROM python:3.10-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH=/root/.local/bin:$PATH \
    PYTHONPATH=/app

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /root/.local /root/.local
COPY apps/api /app

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/api/v1/health || exit 1

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
"""

dockerfile_web = """FROM node:20-alpine AS deps
WORKDIR /app
COPY apps/web/package.json apps/web/package-lock.json* ./
RUN npm install

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY apps/web ./
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./
COPY --from=deps /app/node_modules ./node_modules
COPY apps/web/package.json ./package.json

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["npm", "start"]
"""

docker_compose = """version: '3.8'

services:
  api:
    build:
      context: .
      dockerfile: docker/Dockerfile.api
    container_name: opsintel-api
    ports:
      - "8000:8000"
    environment:
      - ENVIRONMENT=production
      - DEBUG=false
      - DATABASE_URL=sqlite:///./opsintel.db
      - SECRET_KEY=enterprise-opsintel-super-secure-production-jwt-key-999
      - CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
    volumes:
      - api-data:/app
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/api/v1/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  web:
    build:
      context: .
      dockerfile: docker/Dockerfile.web
    container_name: opsintel-web
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
    depends_on:
      - api
    restart: unless-stopped

volumes:
  api-data:
"""

ci_workflow = """name: OpsIntel CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  backend-test:
    name: Backend Tests & ML Validation
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v4

    - name: Set up Python 3.10
      uses: actions/setup-python@v5
      with:
        python-version: '3.10'
        cache: 'pip'

    - name: Install Dependencies
      run: |
        python -m pip install --upgrade pip
        pip install -r apps/api/requirements.txt
        pip install pytest httpx

    - name: Run Pytest Test Suite
      env:
        PYTHONPATH: apps/api
      run: |
        pytest apps/api/tests/test_backend.py -v --durations=10

  frontend-check:
    name: Frontend Lint & Build Check
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v4

    - name: Set up Node.js 20
      uses: actions/setup-node@v4
      with:
        node-version: 20
        cache: 'npm'
        cache-dependency-path: apps/web/package.json

    - name: Install Frontend Dependencies
      working-directory: ./apps/web
      run: npm install

    - name: Build Next.js Application
      working-directory: ./apps/web
      run: npm run build
      env:
        NEXT_PUBLIC_API_URL: http://localhost:8000/api/v1
        NEXT_TELEMETRY_DISABLED: 1
"""

files = {
    BASE / "docker" / "Dockerfile.api": dockerfile_api,
    BASE / "docker" / "Dockerfile.web": dockerfile_web,
    BASE / "docker-compose.yml": docker_compose,
    BASE / ".github" / "workflows" / "ci.yml": ci_workflow,
}

for path, content in files.items():
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Wrote {path.name}")
