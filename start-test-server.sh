#!/bin/bash

# Mobile Testing Server Startup Script
# Starts a local web server for testing mobile fixes

echo "🚀 Starting Mobile Testing Server..."
echo ""
echo "==============================================="
echo "  SEVER Network - Mobile Testing Suite"
echo "==============================================="
echo ""

# Check if port 8080 is available
PORT=8080
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "⚠️  Port $PORT is already in use. Trying port 8081..."
    PORT=8081
fi

echo "📡 Server will start on port: $PORT"
echo ""
echo "🧪 Available Test Pages:"
echo "   1. Main Site:          http://localhost:$PORT/index.html"
echo "   2. Visual Tests:       http://localhost:$PORT/mobile-test-visual.html"
echo "   3. Device Tests:       http://localhost:$PORT/test-devices.html"
echo ""
echo "📱 Mobile Testing Instructions:"
echo "   • Open any test page above in your browser"
echo "   • Press F12 to open DevTools"
echo "   • Click the device toggle icon (phone/tablet)"
echo "   • Select a device or set custom dimensions"
echo "   • Recommended: Start with iPhone 12 (390x844)"
echo ""
echo "🎯 Quick Tests:"
echo "   • Resize browser to < 768px width"
echo "   • Hamburger menu should appear"
echo "   • Touch targets should be 44px minimum"
echo "   • All tests should pass in test pages"
echo ""
echo "==============================================="
echo "Press Ctrl+C to stop the server"
echo "==============================================="
echo ""

# Start Python HTTP server (works with both Python 2 and 3)
if command -v python3 &> /dev/null; then
    python3 -m http.server $PORT
elif command -v python &> /dev/null; then
    python -m SimpleHTTPServer $PORT
else
    echo "❌ Error: Python not found. Please install Python to run the test server."
    exit 1
fi
