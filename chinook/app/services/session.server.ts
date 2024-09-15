import {createCookie, createFileSessionStorage} from '@remix-run/node'

const sessionCookie = createCookie('__session', {
  sameSite: 'lax', // this helps with CSRF
  path: '/',
//  domain: process.env.COOKIE_DOMAIN, // not needed for localhost
  httpOnly: true, // for security reasons, make this cookie http only
  secrets: ['s3cr3t'], // replace this with an actual secret
  //secure: process.env.NODE_ENV === "production", // enable this in prod only
  // secure: true, // if you have always-on HTTPS, enable this, in all environments
  maxAge: 60 * 60, // 1 hour
})

export const sessionStorage = createFileSessionStorage({
  dir: './build/sessions',
  cookie: sessionCookie,
})

// define the user model
export type User = {
  name: string
  token: string
}

export const { getSession, commitSession, destroySession } = sessionStorage
