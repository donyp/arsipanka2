# Use Node.js 18 slim as base image
FROM node:18-slim

# Set working directory early
WORKDIR /app

# Update apt and install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    unzip \
    ca-certificates \
    rclone \
    git \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Install Alist (optional, comment out if not needed)
RUN curl -L https://github.com/alist-org/alist/releases/latest/download/alist-linux-amd64.tar.gz -o /tmp/alist.tar.gz \
    && tar -zxvf /tmp/alist.tar.gz -C /tmp \
    && mv /tmp/alist /usr/local/bin/alist \
    && chmod +x /usr/local/bin/alist \
    && rm /tmp/alist.tar.gz

# Copy backend dependencies first (better layer caching)
COPY backend/package*.json ./backend/
RUN cd backend && npm install --production && npm cache clean --force

# Copy frontend files
COPY css ./css
COPY js ./js
COPY *.html ./
COPY *.md ./

# Copy backend application
COPY backend ./backend
COPY start.sh ./

# Copy rclone.conf if it exists (optional for local storage)
# Note: This file is in .gitignore, so it won't be in HF build
# For rclone support, mount config at runtime or provide via secrets
RUN touch /app/rclone.conf || true

# Ensure scripts are executable
RUN chmod +x /app/start.sh

# Create data directories
RUN mkdir -p /app/data/log /app/data/temp /app/backend/data/log /app/backend/data/temp

# Environment variables
ENV PORT=7860
ENV NODE_ENV=production
ENV NODE_OPTIONS=--max-old-space-size=512

# Expose port (Hugging Face default)
EXPOSE 7860

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:7860/api/heartbeat || exit 1

# Start application
CMD ["/bin/bash", "/app/start.sh"]
