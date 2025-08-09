# 🚀 Quick Start Guide - AllOrigins Cloudflare Worker

Get your AllOrigins API running on Cloudflare Workers in just a few minutes!

## Prerequisites

- Node.js 18+ installed
- A Cloudflare account (free tier works)

## 1. Setup

```bash
# Install Wrangler CLI globally
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Set up the project
cp package-worker.json package.json
npm install
```

## 2. Quick Deploy

### Option A: Use the Deploy Script
```bash
chmod +x deploy.sh
./deploy.sh
```

### Option B: Manual Deploy
```bash
# Deploy directly
wrangler deploy

# Or for development
wrangler dev
```

## 3. Test Your Deployment

Once deployed, test with these URLs:

```bash
# Get page contents as JSON
https://your-worker.your-subdomain.workers.dev/get?url=https://httpbin.org/json

# Get raw content
https://your-worker.your-subdomain.workers.dev/raw?url=https://httpbin.org/html

# Get page info only
https://your-worker.your-subdomain.workers.dev/info?url=https://httpbin.org/json
```

## 4. Configuration (Optional)

### Custom Domain
Edit `wrangler.toml`:
```toml
[env.production]
route = "api.yourdomain.com/*"
```

### Environment Variables
```toml
[vars]
DEBUG = "false"
USER_AGENT = "Custom User Agent"
```

## 5. Examples

### JavaScript/Fetch
```javascript
// Get contents
const response = await fetch('https://your-worker.workers.dev/get?url=https://example.com');
const data = await response.json();
console.log(data.contents);

// Get raw HTML
const raw = await fetch('https://your-worker.workers.dev/raw?url=https://example.com');
const html = await raw.text();
```

### cURL
```bash
# JSON response
curl "https://your-worker.workers.dev/get?url=https://httpbin.org/json"

# Raw response
curl "https://your-worker.workers.dev/raw?url=https://httpbin.org/json"

# Page info
curl "https://your-worker.workers.dev/info?url=https://httpbin.org/json"
```

### jQuery/AJAX
```javascript
$.getJSON('https://your-worker.workers.dev/get?url=https://example.com&callback=?', function(data) {
    console.log(data.contents);
});
```

## 6. Key Features

✅ **CORS Enabled** - Works from any domain  
✅ **Global CDN** - 200+ edge locations worldwide  
✅ **Auto-scaling** - Handles traffic spikes automatically  
✅ **Fast** - Sub-50ms cold starts  
✅ **Reliable** - 99.9%+ uptime  
✅ **Cost-effective** - Pay per request  

## 7. API Reference

### Endpoints

| Endpoint | Description | Example |
|----------|-------------|---------|
| `/get` | Returns page contents as JSON | `/get?url=https://example.com` |
| `/raw` | Returns raw page content | `/raw?url=https://example.com` |
| `/info` | Returns page metadata only | `/info?url=https://example.com` |

### Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `url` | Target URL to fetch (required) | - |
| `callback` | JSONP callback function name | - |
| `charset` | Character encoding for the response | utf-8 |

### Response Format

#### JSON Response (`/get`)
```json
{
  "contents": "<html>...</html>",
  "status": {
    "url": "https://example.com",
    "content_type": "text/html",
    "content_length": 1234,
    "http_code": 200
  }
}
```

#### Info Response (`/info`)
```json
{
  "url": "https://example.com",
  "content_type": "text/html", 
  "content_length": 1234,
  "http_code": 200
}
```

## 8. Troubleshooting

### Worker Not Responding
- Check `wrangler dev` for local testing
- Verify `wrangler.toml` configuration
- Check Cloudflare dashboard for deployment status

### CORS Issues
- The Worker automatically adds CORS headers
- Make sure you're using the correct Worker URL

### Rate Limiting
- Cloudflare Workers have generous free tier limits
- For high traffic, consider upgrading to paid plan

## 9. Next Steps

- Set up a custom domain
- Monitor usage in Cloudflare dashboard
- Explore advanced caching options
- Set up alerts and analytics

## Support

- 📖 Full documentation: See `README-worker.md`
- 🔧 Migration guide: See `MIGRATION.md`
- 🐛 Issues: Check the original repository

---

**That's it!** Your AllOrigins API is now running globally on Cloudflare's edge network! 🎉