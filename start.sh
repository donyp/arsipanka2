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
chmod 777 /app/data /app/data/log /app/data/temp

# Export PORT for Hugging Face (default 7860)
export PORT=${PORT:-7860}
export NODE_ENV=production

echo "[INIT] PORT is set to: $PORT"
echo "[INIT] NODE_ENV is set to: $NODE_ENV"

# Generate rclone.conf from environment variables
echo "[INIT] Generating rclone.conf from environment variables..."
node /app/generate-rclone-config.js

# Start Alist in background (optional, on port 5244)
ALIST_PID=""
if command -v alist &> /dev/null; then
    echo "[INIT] Starting Alist service..."
    # Run Alist with output going to both log and console
    alist server --data /app/data -p 5244 2>&1 | tee /app/data/log/alist.log &
    ALIST_PID=$!
    echo "[INIT] ✅ Alist started with PID: $ALIST_PID on port 5244"
    sleep 4
    # Verify Alist started
    if ps -p $ALIST_PID > /dev/null 2>&1; then
        echo "[INIT] ✅ Alist process verified running (PID $ALIST_PID)"
    else
        echo "[INIT] ❌ Alist process died immediately, checking logs..."
        [ -f /app/data/log/alist.log ] && cat /app/data/log/alist.log | head -50
    fi
else
    echo "[INIT] ⚠️  Alist command not found - file manager will not be available"
fi

# Function to clean up processes
cleanup() {
    echo "[SHUTDOWN] Cleaning up processes..."
    [ ! -z "$ALIST_PID" ] && kill $ALIST_PID 2>/dev/null
    exit 0
}

# Trap signals for graceful shutdown
trap cleanup SIGTERM SIGINT

# Navigate to backend and start Node server
echo "[INIT] Starting Node.js backend server..."
cd /app/backend

# Start Node without exec - run in foreground
# This way, when the container receives a signal, this script can forward it
node server.js 2>&1

# Node exited, clean up and exit
echo "[SHUTDOWN] Node.js server exited"
cleanup
