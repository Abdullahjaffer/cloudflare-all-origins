# Migration Guide: Node.js to Cloudflare Workers

This document outlines the key changes made to convert the AllOrigins Node.js application to a Cloudflare Worker.

## Key Architectural Changes

### 1. Runtime Environment
- **From**: Node.js with Express.js
- **To**: Cloudflare Workers with Fetch API

### 2. HTTP Server
- **From**: Express.js router and middleware
- **To**: Native fetch event handler

### 3. HTTP Client
- **From**: `got` library with `agentkeepalive`
- **To**: Native `fetch` API with Cloudflare optimizations

### 4. Module System
- **From**: CommonJS (`require`/`module.exports`)
- **To**: ES Modules (`import`/`export`)

### 5. Dependencies Removed
- `express` - Replaced with native Worker fetch handler
- `got` - Replaced with native fetch
- `agentkeepalive` - Not needed with Workers
- `iconv-lite` - Replaced with native TextDecoder

## File Structure Changes

### New Files
```
worker.js              # Main Worker entry point
_worker.js             # Simplified alternative entry point
wrangler.toml          # Cloudflare Worker configuration
package-worker.json    # Worker-specific package.json
deploy.sh              # Deployment script
README-worker.md       # Worker-specific documentation
src/                   # Modularized source code
├── get-page.js        # Page fetching logic
├── http-client.js     # HTTP client wrapper
├── logger.js          # Logging utilities
└── quick-lru.js       # Caching implementation
```

### Modified Functionality

#### CORS Handling
**Before (Express.js)**:
```javascript
function enableCORS(req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*')
  // ... more headers
  next()
}
app.use(enableCORS)
```

**After (Workers)**:
```javascript
const corsHeaders = {
  'Access-Control-Allow-Origin': request.headers.get('origin') || '*',
  // ... more headers
}
return new Response(body, { headers: corsHeaders })
```

#### Request Processing
**Before (Express.js)**:
```javascript
app.all('/:format(get|raw|json|info)', processRequest)

function parseParams(req) {
  return {
    requestMethod: req.method,
    ...req.query,
    ...req.params,
  }
}
```

**After (Workers)**:
```javascript
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)
    const params = parseParams(request, url)
    // ...
  }
}

function parseParams(request, url) {
  const pathSegments = url.pathname.split('/').filter(Boolean)
  return {
    requestMethod: request.method,
    format: pathSegments[0] || 'json',
    url: url.searchParams.get('url'),
    // ...
  }
}
```

#### HTTP Client
**Before (got)**:
```javascript
const got = require('got')
const response = await got(url, options)
```

**After (fetch)**:
```javascript
const response = await fetch(url, {
  method: options.method,
  headers: options.headers,
  cf: { cacheTtl: 3600 }
})
```

#### Response Handling
**Before (Express.js)**:
```javascript
res.set('Cache-control', `public, max-age=${maxAge}`)
res.send(Buffer.from(JSON.stringify(page)))
```

**After (Workers)**:
```javascript
const headers = {
  'Cache-Control': `public, max-age=${maxAge}`,
  'Content-Type': 'application/json'
}
return new Response(JSON.stringify(page), { headers })
```

## Performance Improvements

### 1. Global Edge Deployment
- Workers run at 200+ Cloudflare edge locations
- Sub-50ms cold start times
- Automatic geographic routing

### 2. Built-in Caching
- Cloudflare's edge cache integration
- No need for external Redis/Memcached
- Automatic cache invalidation

### 3. Scalability
- Automatic scaling based on demand
- No server provisioning or management
- Pay-per-request pricing model

## Compatibility

### API Compatibility
The Worker version maintains 100% API compatibility:
- All existing endpoints work unchanged
- Same request/response format
- Same error handling
- Same CORS behavior

### Client Compatibility
No changes required for existing clients:
- Same URL structure
- Same parameters
- Same response format
- Same headers

## Deployment Differences

### Node.js Deployment
```bash
npm install
npm start
# Requires server management, load balancing, etc.
```

### Worker Deployment
```bash
npm install -g wrangler
wrangler login
wrangler deploy
# Automatic global deployment, no server management
```

## Environment Variables

### Node.js
```bash
PORT=1458
DEBUG=1
USER_AGENT="Custom Agent"
```

### Workers
```toml
# wrangler.toml
[vars]
DEBUG = "false"
USER_AGENT = "Custom Agent"
```

## Testing

### Local Development
**Node.js**: `node server.js`
**Workers**: `wrangler dev`

### Testing Endpoints
Both versions support the same test cases:
```bash
curl 'https://your-domain.com/get?url=https://httpbin.org/json'
curl 'https://your-domain.com/raw?url=https://httpbin.org/json'
curl 'https://your-domain.com/info?url=https://httpbin.org/json'
```

## Benefits of Migration

1. **No Server Management**: Serverless deployment
2. **Global Performance**: Edge deployment worldwide
3. **Cost Efficiency**: Pay-per-request model
4. **Auto Scaling**: Handles traffic spikes automatically
5. **Built-in Security**: DDoS protection included
6. **High Availability**: 99.9%+ uptime guarantee
7. **Easy Deployment**: Single command deployment