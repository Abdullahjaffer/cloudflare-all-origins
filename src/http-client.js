import { QuickLRU } from './quick-lru.js'

const DEFAULT_USER_AGENT = `Mozilla/5.0 (compatible; allOrigins/${globalThis.AO_VERSION}; +http://allorigins.win/)`

class HttpClient {
  constructor() {
    this.cache = new QuickLRU({ maxSize: 1000 })
  }

  async request(url, options = {}) {
    const requestOptions = {
      method: options.method || 'GET',
      headers: {
        'User-Agent': DEFAULT_USER_AGENT,
        ...options.headers
      },
      // Cloudflare Workers have built-in compression handling
      cf: {
        // Cache everything for 1 hour by default
        cacheTtl: 3600,
        cacheEverything: true
      }
    }

    // Handle caching for GET/HEAD requests
    const cacheKey = `${requestOptions.method}:${url}`
    
    if (['GET', 'HEAD'].includes(requestOptions.method)) {
      const cachedResponse = this.cache.get(cacheKey)
      if (cachedResponse) {
        return cachedResponse
      }
    }

    try {
      const response = await fetch(url, requestOptions)
      
      const result = {
        statusCode: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        body: null,
        url: response.url
      }

      if (requestOptions.method !== 'HEAD') {
        result.body = new Uint8Array(await response.arrayBuffer())
      }

      // Cache successful responses
      if (response.ok && ['GET', 'HEAD'].includes(requestOptions.method)) {
        this.cache.set(cacheKey, result)
      }

      return result
    } catch (error) {
      throw {
        response: null,
        message: error.message,
        code: 'NETWORK_ERROR'
      }
    }
  }
}

export const httpClient = new HttpClient()