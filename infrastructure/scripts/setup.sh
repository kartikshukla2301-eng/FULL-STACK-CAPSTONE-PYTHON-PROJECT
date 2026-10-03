#!/usr/bin/env bash
set -e

echo "===================================================="
echo "🚀 TaskFlow Pro - Automated Local Development Setup"
echo "===================================================="

echo "[1/4] Building Docker containers..."
docker-compose build

echo "[2/4] Starting PostgreSQL and Redis containers..."
docker-compose up -d postgres redis

echo "[3/4] Running database seed script..."
python infrastructure/scripts/seed_data.py

echo "[4/4] Starting full stack (Backend & Frontend)..."
docker-compose up -d

echo ""
echo "✅ Setup complete!"
echo "• Frontend: http://localhost:3000"
echo "• Backend API Docs: http://localhost:8000/docs"
echo "• Demo Login: demo@taskflow.com / demo123!"
