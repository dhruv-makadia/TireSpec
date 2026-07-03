const COOKIE_NAME = 'tirespec_session'

function setCookie(name, value, expiresAt) {
  const expires = new Date(expiresAt).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; samesite=lax`
}

function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; samesite=lax`
}

export function clearSessionCookie() {
  deleteCookie(COOKIE_NAME)
}

export function getSessionCookie() {
  const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
    const [name, ...rest] = cookie.split('=')
    acc[name] = rest.join('=')
    return acc
  }, {})
  if (!cookies[COOKIE_NAME]) {
    return null
  }

  try {
    return JSON.parse(decodeURIComponent(cookies[COOKIE_NAME]))
  } catch {
    return null
  }
}

export async function ensureSession(websiteId = '00000000-0000-0000-0000-000000000000') {
  clearSessionCookie()

  const response = await fetch('/api/sessions/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ websiteId }),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`Session create failed: ${errorBody}`)
  }

  const session = await response.json()
  setCookie(COOKIE_NAME, JSON.stringify(session), session.expire)
  return session
}
