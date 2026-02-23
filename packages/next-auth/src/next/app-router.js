import NextAuthHandler from "../server/index.js"

class MockResponse {
  constructor() {
    this.statusCode = 200
    this.headers = new Map()
    this.body = undefined
    this.redirectUrl = null
    this.ended = false
    this.cookies = []
  }

  status(code) {
    this.statusCode = code
    return this
  }

  json(data) {
    this.body = JSON.stringify(data)
    return this
  }

  send(data) {
    this.body = data
    return this
  }

  end(data) {
    if (data) this.body = data
    this.ended = true
    return this
  }

  redirect(url) {
    this.redirectUrl = url
    return this
  }

  setHeader(name, value) {
    this.headers.set(name, value)
    return this
  }

  getHeader(name) {
    return this.headers.get(name)
  }

  getHeaders() {
    return Object.fromEntries(this.headers)
  }

  getCookies() {
    return this.cookies
  }
}

function adaptRequest(req) {
  const url = req.nextUrl
  const pathname = url.pathname

  const pathParts = pathname.split("/").filter(Boolean)
  const authIndex = pathParts.indexOf("auth")

  const query = { ...url.searchParams }

  if (authIndex !== -1) {
    const nextauth = pathParts.slice(authIndex + 1)
    if (nextauth.length > 0) {
      query.nextauth = nextauth
    }
  }

  const headers = {}
  req.headers.forEach((value, key) => {
    headers[key] = value
  })

  const cookies = {}
  req.cookies.getAll().forEach((cookie) => {
    cookies[cookie.name] = cookie.value
  })

  return {
    method: req.method,
    url: req.url,
    query,
    headers,
    cookies,
    body: req.body || {},
    referrer: headers.referer || headers.referrer || "",
  }
}

function adaptResponse(res) {
  return {
    status(code) {
      res.statusCode = code
      return this
    },
    json(data) {
      res.body = JSON.stringify(data)
      return this
    },
    redirect(url) {
      res.redirectUrl = url
      return this
    },
    end(data) {
      if (data) res.body = data
      res.ended = true
      return this
    },
    setHeader(name, value) {
      res.headers.set(name, value)
      return this
    },
    getHeader(name) {
      return res.headers.get(name)
    },
    getHeaders() {
      return Object.fromEntries(res.headers)
    },
  }
}

export default function GET(req, ctx) {
  return handleRequest(req, ctx)
}

export function POST(req, ctx) {
  return handleRequest(req, ctx)
}

async function handleRequest(req, ctx) {
  const adaptedReq = adaptRequest(req)

  const mockRes = new MockResponse()
  const adaptedRes = adaptResponse(mockRes)

  await NextAuthHandler(adaptedReq, adaptedRes, ctx?.params?.options || ctx)

  if (mockRes.redirectUrl) {
    return Response.redirect(mockRes.redirectUrl, mockRes.statusCode || 302)
  }

  const responseHeaders = new Headers()
  mockRes.headers.forEach((value, key) => {
    responseHeaders.set(key, value)
  })

  if (mockRes.cookies && mockRes.cookies.length > 0) {
    mockRes.cookies.forEach((cookie) => {
      responseHeaders.append("Set-Cookie", cookie)
    })
  }

  const responseOptions = {
    status: mockRes.statusCode,
    headers: responseHeaders,
  }

  if (mockRes.body) {
    try {
      return new Response(JSON.stringify(mockRes.body), responseOptions)
    } catch {
      return new Response(mockRes.body, responseOptions)
    }
  }

  return new Response(null, responseOptions)
}
