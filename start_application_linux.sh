#!/usr/bin/env bash

# -------------------------------
# Setup Frontend
# -------------------------------
echo "Setup Frontend"
if command -v node >/dev/null 2>&1; then
    echo "Node ist already installed, skip"
else
    echo "⬇Node.js is not installed, installing..."
    curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi
cd analyzer-frontend

echo "npm install..."
npm install

echo "Start Vue App..."
npm run dev &

# -------------------------------
# Setup Backend
# -------------------------------

if command -v go >/dev/null 2>&1; then
    echo "Go ist already installed, skip"
else
    echo "Go 1.24 installing via apt..."
    sudo apt update
    sudo apt install -y golang-go
fi

echo "Setup Backend"

cd ..
cd bff-api

go run main.go
