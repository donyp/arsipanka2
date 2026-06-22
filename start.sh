#!/bin/bash

# Pusat Arsip Anka - Startup Script for Hugging Face Spaces
# This script handles all services startup

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
    alist server --data /app/data -p 5244 > /app/data/log/alist.log 2>&1 &
    ALIST_PID=$!
    echo "[INIT] Alist started with PID: $ALIST_PID on port 5244"
    sleep 3
    
    # Verify Alist is running
    if ps -p $ALIST_PID > /dev/null; then
        echo "[INIT] ✅ Alist service confirmed running on port 5244"
    else
        echo "[INIT] ⚠️  Alist service may have failed to start (see /app/data/log/alist.log)"
    fi
else
    echo "[INIT] ⚠️  Alist command not found - file manager will not be available"
fi

# Navigate to backend and start Node server
echo "[INIT] Starting Node.js backend server..."
cd /app/backend

# Start the main application with better error handling
exec node server.js 2>&1
