#!/bin/bash

node src/server/index.js &
BACKEND_PID=$!
echo "Backend started (PID: $BACKEND_PID)"

sleep 2

export PORT=5000
export DEV_WEB_ONLY=true
export CHATBOX_BUILD_PLATFORM=web
export NODE_ENV=development
export TS_NODE_TRANSPILE_ONLY=true

npx webpack serve --config ./.erb/configs/webpack.config.renderer.dev.ts
