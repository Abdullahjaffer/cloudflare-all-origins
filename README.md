# AllOrigins - Cloudflare Worker

🚀 **A powerful API to pull contents from any page via Cloudflare Workers**

Pull contents from any page as JSON/P or raw and avoid [Same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy) problems. This is a Cloudflare Worker version that runs on the edge for maximum performance and global availability.

> A free and open source javascript clone of [AnyOrigin](https://web.archive.org/web/20180807105808/https://anyorigin.com/) optimized for Cloudflare Workers.

## ⚡ Quick Start

### 1. Deploy to Cloudflare Workers

```bash
# Install Wrangler CLI
npm install -g wrangler

# Clone and setup
git clone https://github.com/gnuns/allOrigins.git
cd allOrigins
npm install

# Login to Cloudflare and deploy
wrangler login
npm run deploy
```

### 2. Use the API

Once deployed, your API will be available at `https://your-worker.your-subdomain.workers.dev`

## 📖 API Usage

#### Examples

Get contents as JSON:

```javascript
fetch(
	`https://your-worker.workers.dev/get?url=${encodeURIComponent(
		"https://httpbin.org/json"
	)}`
)
	.then((response) => response.json())
	.then((data) => console.log(data.contents));
```

With jQuery/JSONP:

```javascript
$.getJSON(
	"https://your-worker.workers.dev/get?url=" +
		encodeURIComponent("https://httpbin.org/json"),
	function (data) {
		console.log(data.contents);
	}
);
```

Get raw content:

```javascript
fetch(
	`https://your-worker.workers.dev/raw?url=${encodeURIComponent(
		"https://httpbin.org/html"
	)}`
)
	.then((response) => response.text())
	.then((html) => console.log(html));
```

## 🛠️ API Options

### Endpoints

- **`/get`** - Return content as JSON (default)
- **`/raw`** - Return raw content without processing
- **`/info`** - Return only header information

### Parameters

- **`url`** - Target URL to fetch (required)
- **`charset`** - Character encoding (default: utf-8)
- **`callback`** - JSONP callback function name

### Response Format

**JSON Response (`/get`):**

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

**Info Response (`/info`):**

```json
{
	"url": "https://example.com",
	"content_type": "text/html",
	"content_length": 1234,
	"http_code": 200
}
```

## 🌟 Features

- ✅ **Global Edge Network** - 200+ locations worldwide
- ✅ **Lightning Fast** - Sub-50ms cold starts
- ✅ **Auto-scaling** - Handles traffic spikes automatically
- ✅ **CORS Enabled** - Works from any domain
- ✅ **Cost Effective** - Pay-per-request pricing
- ✅ **No Server Management** - Completely serverless
- ✅ **Built-in Caching** - Optimized performance
- ✅ **JSONP Support** - Cross-domain requests

## 📁 Project Structure

```
├── worker.js              # Main Cloudflare Worker entry point
├── _worker.js             # Simplified alternative entry point
├── wrangler.toml          # Cloudflare Worker configuration
├── src/                   # Source modules
│   ├── get-page.js        # Page fetching logic
│   ├── http-client.js     # HTTP client wrapper
│   ├── logger.js          # Logging utilities
│   └── quick-lru.js       # Caching implementation
├── deploy.sh              # Deployment script
├── test-worker.js         # Simple tests
└── package.json           # Dependencies and scripts
```

## 🚀 Development

```bash
# Local development
npm run dev

# Deploy to production
npm run deploy
```

## 📚 Documentation

- **[QUICK-START.md](QUICK-START.md)** - Get up and running in minutes

## 🔧 Configuration

Edit `wrangler.toml` for custom settings:

```toml
name = "allorigins"
main = "worker.js"
compatibility_date = "2024-01-15"

# Optional: Custom domain
# [env.production]
# route = "api.yourdomain.com/*"
```

## 🆚 Why Cloudflare Workers?

Compared to traditional Node.js hosting:

| Feature               | Node.js       | Cloudflare Workers            |
| --------------------- | ------------- | ----------------------------- |
| **Global Deployment** | Manual setup  | ✅ Automatic (200+ locations) |
| **Cold Start**        | ~1-5 seconds  | ✅ <50ms                      |
| **Scaling**           | Manual        | ✅ Automatic                  |
| **DDoS Protection**   | Extra service | ✅ Built-in                   |
| **Server Management** | Required      | ✅ Serverless                 |
| **Cost**              | Fixed monthly | ✅ Pay-per-request            |

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

**🌍 Deploy globally in minutes and serve millions of requests with ease!** 🚀
