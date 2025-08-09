#!/bin/bash

# AllOrigins Cloudflare Worker Deployment Script

echo "🚀 Deploying AllOrigins to Cloudflare Workers..."

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler CLI not found. Installing..."
    npm install -g wrangler
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if user is logged in to Wrangler
echo "🔐 Checking Wrangler authentication..."
if ! wrangler whoami &> /dev/null; then
    echo "❌ Not logged in to Wrangler. Please run: wrangler login"
    exit 1
fi

# Deploy to Cloudflare Workers
echo "🚀 Deploying to Cloudflare Workers..."
wrangler deploy

echo "✅ Deployment complete!"
echo ""
echo "🌍 Your AllOrigins Worker is now live!"
echo ""
echo "Test your deployment with:"
echo "curl 'https://your-worker.your-subdomain.workers.dev/get?url=https://httpbin.org/json'"