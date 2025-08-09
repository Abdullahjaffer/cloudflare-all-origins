// Alternative simpler entry point without ES modules
// Use this if you prefer a more traditional approach

const version = "2.7.0";
globalThis.AO_VERSION = version;

// Simplified fetch handler for basic functionality
export default {
  async fetch(request, env, ctx) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Via': `allOrigins v${version}`
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      const url = new URL(request.url);
      const targetUrl = url.searchParams.get('url');
      const format = url.pathname.split('/')[1] || 'json';

      if (!targetUrl) {
        return new Response(JSON.stringify({
          error: 'Missing url parameter'
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Basic fetch implementation
      const response = await fetch(targetUrl, {
        cf: {
          cacheTtl: 3600,
          cacheEverything: true
        }
      });

      let result;
      if (format === 'raw') {
        return new Response(response.body, {
          headers: {
            ...corsHeaders,
            'Content-Type': response.headers.get('Content-Type') || 'text/plain'
          }
        });
      } else if (format === 'info') {
        result = {
          url: targetUrl,
          content_type: response.headers.get('Content-Type'),
          content_length: parseInt(response.headers.get('Content-Length')) || -1,
          http_code: response.status
        };
      } else {
        const content = await response.text();
        result = {
          contents: content,
          status: {
            url: targetUrl,
            content_type: response.headers.get('Content-Type'),
            content_length: content.length,
            http_code: response.status
          }
        };
      }

      return new Response(JSON.stringify(result), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });

    } catch (error) {
      return new Response(JSON.stringify({
        error: 'Failed to fetch',
        message: error.message
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};