/*!
 * AllOrigins - Cloudflare Worker Version
 * written by Gabriel Nunes <gabriel@multiverso.me>
 * http://github.com/gnuns
 */

import { getPage } from './src/get-page.js'
import { getLogger } from './src/logger.js'

// Global version for compatibility - hardcoded for Worker compatibility
const version = "2.7.0"
globalThis.AO_VERSION = version

const logger = getLogger(false) // Cloudflare Workers don't have process.env.DEBUG by default

const DEFAULT_CACHE_TIME = 60 * 60 // 60 minutes
const MIN_CACHE_TIME = 5 * 60 // 5 minutes

export default {
  async fetch(request, env, ctx) {
    return handleRequest(request, env, ctx)
  }
}

async function handleRequest(request, env, ctx) {
  const startTime = new Date()
  
  // Enable CORS
  const corsHeaders = {
    'Access-Control-Allow-Origin': request.headers.get('origin') || '*',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Content-Encoding, Accept',
    'Access-Control-Allow-Methods': 'OPTIONS, GET, POST, PATCH, PUT, DELETE',
    'Via': `allOrigins v${version}`
  }

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders
    })
  }

  try {
    const url = new URL(request.url)
    const params = parseParams(request, url)
    
    // Check if format is valid
    if (!['get', 'raw', 'json', 'info'].includes(params.format)) {
      return new Response('Invalid format', { 
        status: 400,
        headers: corsHeaders
      })
    }

    const page = await getPage(params, env)
    
    const response = await createResponse(page, params, corsHeaders, startTime)
    
    // Log the request
    logger.requestProcessed({
      format: params.format,
      headers: Object.fromEntries(request.headers.entries()),
      status: {
        ...(typeof page.status !== 'object'
          ? {
              response_time: new Date() - startTime,
            }
          : page.status),
        url: params.url,
      },
    })
    
    return response
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: error.message 
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    })
  }
}

function parseParams(request, url) {
  const pathSegments = url.pathname.split('/').filter(Boolean)
  const format = pathSegments[0] || 'json'
  
  const params = {
    requestMethod: request.method,
    format: format.toLowerCase(),
    url: url.searchParams.get('url'),
    charset: url.searchParams.get('charset'),
    callback: url.searchParams.get('callback'),
    disableCache: url.searchParams.get('disableCache') === 'true',
    cacheMaxAge: url.searchParams.get('cacheMaxAge')
  }
  
  params.requestMethod = parseRequestMethod(params.requestMethod)
  return params
}

function parseRequestMethod(method) {
  method = (method || '').toUpperCase()

  if (['HEAD', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'].includes(method)) {
    return method
  }
  return 'GET'
}

async function createResponse(page, params, corsHeaders, startTime) {
  const headers = { ...corsHeaders }
  
  if (['GET', 'HEAD'].includes(params.requestMethod)) {
    const maxAge = params.disableCache
      ? 0
      : Math.max(
          MIN_CACHE_TIME,
          Number(params.cacheMaxAge) || DEFAULT_CACHE_TIME
        )

    headers['Cache-Control'] = `public, max-age=${maxAge}, stale-if-error=600`
  }

  if (params.format === 'raw' && !(page.status || {}).error) {
    headers['Content-Length'] = page.contentLength?.toString()
    headers['Content-Type'] = page.contentType
    
    return new Response(page.content, { headers })
  }

  headers['Content-Type'] = `application/json; charset=${params.charset || 'utf-8'}`

  if (page.status) {
    page.status.response_time = new Date() - startTime
  } else {
    page.response_time = new Date() - startTime
  }

  let responseBody
  if (params.callback) {
    // JSONP response
    responseBody = `${params.callback}(${JSON.stringify(page)})`
    headers['Content-Type'] = 'application/javascript'
  } else {
    responseBody = JSON.stringify(page)
  }

  return new Response(responseBody, { headers })
}