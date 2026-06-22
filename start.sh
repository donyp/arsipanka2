#!/bin/bash

# Pusat Arsip Anka - Startup Script for Hugging Face Spaces
# This script handles all services startup

set -e

echo "=========================================="
echo "Starting Pusat Arsip Anka"
echo "=========================================="

# Create necessary directories
mkdir -p /app/data/log
mkdir -p /app/data/temp
mkdir -p /app/backend/data/log
mkdir -p /app/backend/data/temp

# Export PORT for Hugging Face (default 7860)
export PORT=${PORT:-7860}
export NODE_ENV=production

echo "[INIT] PORT is set to: $PORT"
echo "[INIT] NODE_ENV is set to: $NODE_ENV"

# Start Alist in background (optional, on port 5244)
if command -v alist &> /dev/null; then
    echo "[INIT] Starting Alist service..."
    alist server --data /app/data > /app/data/log/alist.log 2>&1 &
    ALIST_PID=$!
    echo "[INIT] Alist started with PID: $ALIST_PID"
    sleep 2
fi

# Navigate to backend and start Node server
echo "[INIT] Starting Node.js backend server..."
cd /app/backend

# Start the main application
exec node server.js
