#!/bin/bash
# Cloud startup: launch Python backend + Node MCP HTTP server together
#
# PORT handling (Railway / Render / Fly.io):
#   PaaS platforms inject PORT for the external-facing service.
#   MCP HTTP (Node.js) is the external endpoint → uses PORT.
#   Python FastAPI backend is internal → uses fixed BACKEND_PORT (8420).
set -e

echo "=== AwesomeContext Cloud MCP Service ==="

# Capture PaaS PORT before overriding for Python
EXTERNAL_PORT=${PORT:-3000}
INTERNAL_PORT=${BACKEND_PORT:-8420}

echo "External MCP port: ${EXTERNAL_PORT}"
echo "Internal backend port: ${INTERNAL_PORT}"

# Start Python FastAPI backend in background (fixed internal port)
echo "Starting Python backend on port ${INTERNAL_PORT}..."
PORT=${INTERNAL_PORT} python scripts/serve.py &
BACKEND_PID=$!

# Wait for backend to be ready
echo "Waiting for backend to be ready..."
for i in $(seq 1 30); do
    if python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:${INTERNAL_PORT}/v1/health')" 2>/dev/null; then
        echo "Backend ready!"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "ERROR: Backend failed to start within 30 seconds"
        exit 1
    fi
    sleep 1
done

# Start MCP HTTP server in foreground (uses PaaS PORT)
echo "Starting MCP HTTP server on port ${EXTERNAL_PORT}..."
export MCP_PORT=${EXTERNAL_PORT}
export AC_BACKEND_URL=http://127.0.0.1:${INTERNAL_PORT}
cd /app/mcp-server
exec node dist/server-http.js
