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

# Generate rclone.conf from environment variables
echo "[INIT] Generating rclone.conf from environment variables..."
node /app/generate-rclone-config.js

# Start Alist in background (optional, on port 5244)
if command -v alist &> /dev/null; then
    echo "[INIT] Starting Alist service..."
    alist server --data /app/data -p 5244 > /app/data/log/alist.log 2>&1 &
    ALIST_PID=$!
    echo "[INIT] ✅ Alist started with PID: $ALIST_PID on port 5244"
    sleep 2
    
    # Trap signals to ensure Alist is killed when container stops
    trap "kill $ALIST_PID 2>/dev/null; exit 0" SIGTERM SIGINT
else
    echo "[INIT] ⚠️  Alist command not found - file manager will not be available"
fi

# Navigate to backend and start Node server
echo "[INIT] Starting Node.js backend server..."
cd /app/backend

# Start the main application without 'exec' so background processes remain alive
# Use 'wait' to keep the script running and forward signals properly
node server.js 2>&1 &
NODE_PID=$!

# Wait for both processes, if either dies, exit
wait $NODE_PID
EXIT_CODE=$?

# Kill Alist if Node exits
[ ! -z "$ALIST_PID" ] && kill $ALIST_PID 2>/dev/null

exit $EXIT_CODE
