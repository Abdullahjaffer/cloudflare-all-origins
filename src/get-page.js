import { httpClient } from './http-client.js'

export async function getPage({ url, format, requestMethod, charset }) {
  if (format === 'info' || requestMethod === 'HEAD') {
    return getPageInfo(url)
  } else if (format === 'raw') {
    return getRawPage(url, requestMethod, charset)
  }

  return getPageContents(url, requestMethod, charset)
}

async function getPageInfo(url) {
  const { response, error } = await request(url, 'HEAD')
  if (error) return processError(error)

  return {
    url: url,
    content_type: response.headers['content-type'],
    content_length: +response.headers['content-length'] || -1,
    http_code: response.statusCode,
  }
}

async function getRawPage(url, requestMethod, charset) {
  const { content, response, error } = await request(
    url,
    requestMethod,
    true,
    charset
  )
  if (error) return processError(error)

  return {
    content,
    contentType: response.headers['content-type'],
    contentLength: content.length,
  }
}

async function getPageContents(url, requestMethod, charset) {
  const { content, response, error } = await request(
    url,
    requestMethod,
    false,
    charset
  )
  if (error) return processError(error)

  return {
    contents: content,
    status: {
      url: url,
      content_type: response.headers['content-type'],
      content_length: content.length,
      http_code: response.statusCode,
    },
  }
}

async function request(url, requestMethod, raw = false, charset = null) {
  try {
    const options = {
      method: requestMethod,
    }

    const response = await httpClient.request(url, options)
    if (options.method === 'HEAD') return { response }

    return processContent(response, charset, raw)
  } catch (error) {
    return { error }
  }
}

async function processContent(response, charset, raw) {
  let content = response.body
  
  if (!raw && content) {
    // Convert Uint8Array to string
    const textDecoder = new TextDecoder(charset || 'utf-8')
    content = textDecoder.decode(content)
  }
  
  return { 
    response: response, 
    content: content
  }
}

async function processError(e) {
  const { response } = e
  if (!response) return { contents: null, status: { error: e } }

  const { url, statusCode: http_code, headers, body } = response
  const contentLength = body ? body.length : 0

  let contents = ''
  if (body) {
    const textDecoder = new TextDecoder('utf-8')
    contents = textDecoder.decode(body)
  }

  return {
    contents,
    status: {
      url,
      http_code,
      content_type: headers['content-type'],
      content_length: contentLength,
    },
  }
}