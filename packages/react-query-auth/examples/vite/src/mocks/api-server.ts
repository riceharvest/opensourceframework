import { http, HttpResponse, delay } from 'msw'
import { setupWorker } from 'msw/browser'
import { storage } from '@/lib/utils'
import { DBUser, getUser, setUser, validatePassword } from './db'

async function parseRequestBody(request: Request): Promise<Partial<DBUser> | null> {
  try {
    const parsed = await request.json()
    if (!parsed || typeof parsed !== "object") return null
    return parsed as Partial<DBUser>
  } catch {
    return null
  }
}

const handlers = [
  http.get('/auth/me', async ({ request }) => {
    const user = getUser(request.headers.get('Authorization'))

    await delay(1000);

    return HttpResponse.json({ user })
  }),

  http.post('/auth/login', async ({ request }) => {
    const parsedBody = await parseRequestBody(request)
    const email = typeof parsedBody?.email === "string" ? parsedBody.email : null
    const password =
      typeof parsedBody?.password === "string" ? parsedBody.password : null

    await delay(1000);

    if (validatePassword(email, password) && email) {
      const user = getUser(email)
      return HttpResponse.json({
        jwt: email,
        user,
      })
    }

    return HttpResponse.json(
      { message: 'Invalid credentials' },
      { status: 401 }
    )
  }),

  http.post('/auth/register', async ({ request }) => {
    const parsedBody = await parseRequestBody(request)
    const email = typeof parsedBody?.email === "string" ? parsedBody.email : null
    const name = typeof parsedBody?.name === "string" ? parsedBody.name : null
    const password =
      typeof parsedBody?.password === "string" ? parsedBody.password : null

    await delay(1000);

    if (!email || !name || !password) {
      return HttpResponse.json({ message: 'Registration failed' }, { status: 400 })
    }

    if (!getUser(email)) {
      const newUser = setUser({ email, name, password })
      if (newUser) {
        return HttpResponse.json({
          jwt: newUser.email,
          user: newUser,
        })
      }
    }

    return HttpResponse.json(
      { message: 'Registration failed' },
      { status: 400 }
    )
  }),

  http.post('/auth/logout', async () => {
    storage.clearToken()

    await delay(1000);

    return HttpResponse.json({ message: 'Logged out' })
  }),
]

export const worker = setupWorker(...handlers)
