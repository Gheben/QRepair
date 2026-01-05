#!/bin/sh
set -e

# Create necessary directories if they don't exist
mkdir -p /app/data
mkdir -p /app/uploads

# Create empty files if they don't exist
touch /app/manutenzioni.db 2>/dev/null || true
touch /app/settings.json 2>/dev/null || true

# Execute the main command
exec "$@"
