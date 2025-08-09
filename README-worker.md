# AllOrigins - Cloudflare Worker Version

This is a Cloudflare Worker compatible version of AllOrigins, a service to pull contents from any page as JSON via API.

## Files Overview

### Main Files
- `worker.js` - Main Cloudflare Worker entry point with full functionality
- `_worker.js` - Simplified alternative entry point for basic usage
- `wrangler.toml` - Cloudflare Worker configuration
- `package-worker.json` - Package configuration for Worker development

### Source Files (src/)
- `src/get-page.js` - Page fetching logic adapted for Workers
- `src/http-client.js` - HTTP client using fetch API
- `src/logger.js` - Logging functionality for Workers
- `src/quick-lru.js` - Caching implementation for Workers

## Setup Instructions

1. **Install Wrangler CLI**:
   ```bash
   npm install -g wrangler
   ```

2. **Install Dependencies**:
   ```bash
   cp package-worker.json package.json
   npm install
   ```

3. **Configure Wrangler**:
   - Update `wrangler.toml` with your account details
   - Set the route for your custom domain (optional)

4. **Development**:
   ```bash
   npm run dev
   ```

5. **Deploy**:
   ```bash
   npm run deploy
   ```

## Usage

The API endpoints remain the same as the original AllOrigins:

- **Get page contents**: `GET /get?url=https://example.com`
- **Get raw contents**: `GET /raw?url=https://example.com`
- **Get page info**: `GET /info?url=https://example.com`

### Examples

```javascript
// Get page contents
fetch('https://your-worker.your-subdomain.workers.dev/get?url=https://httpbin.org/json')
  .then(response => response.json())
  .then(data => console.log(data.contents))

// Get raw contents
fetch('https://your-worker.your-subdomain.workers.dev/raw?url=https://httpbin.org/json')
  .then(response => response.text())
  .then(data => console.log(data))

// Get page info
fetch('https://your-worker.your-subdomain.workers.dev/info?url=https://httpbin.org/json')
  .then(response => response.json())
  .then(data => console.log(data))
```

## Key Changes from Node.js Version

1. **HTTP Client**: Replaced `got` with native `fetch` API
2. **Express.js**: Replaced with Cloudflare Workers fetch handler
3. **Dependencies**: Removed Node.js specific dependencies
4. **Caching**: Uses in-memory cache with QuickLRU
5. **No File System**: All operations use Workers runtime

## Features

- ✅ CORS enabled for all origins
- ✅ Caching with configurable TTL
- ✅ Support for all HTTP methods
- ✅ Raw content delivery
- ✅ Page info extraction
- ✅ JSONP callback support
- ✅ Error handling
- ✅ Response time tracking

## Environment Variables

You can configure the following in `wrangler.toml`:

```toml
[vars]
DEBUG = "false"
USER_AGENT = "Custom User Agent"
```

## Performance

Cloudflare Workers provide:
- Global edge deployment
- Sub-50ms cold starts
- Built-in DDoS protection
- Automatic scaling
- Built-in caching at edge locations

## Migration Notes

If migrating from the Node.js version:
1. The API remains fully compatible
2. No client-side changes needed
3. Better performance and global availability
4. No server maintenance required
5. Pay-per-request pricing model