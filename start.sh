#!/bin/bash

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Start the backend server in the background
echo "Starting backend server..."
cd "$SCRIPT_DIR/backend" && node src/server.js &

# Wait a moment for the backend to start
sleep 2

# Start the frontend server
echo "Starting frontend server..."
cd "$SCRIPT_DIR/frontend" && npm start

# This will keep the script running
wait
