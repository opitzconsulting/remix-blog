import {Authenticator} from 'remix-auth'
import keycloakServer from './keycloak.server'
import type {KeycloakAuthProps} from '~/models/auth'
import {commitSession, getSession, sessionStorage} from './session.server'
import {redirect} from '@remix-run/node';

export type RolesProfile = {
  _json: {
    realm_access?: {
      roles: string[]
    }
    resource_access?: {
      [key: string]: {
        roles: string[]
      }
    }
  }
}

export const authenticator = new Authenticator<KeycloakAuthProps>(sessionStorage)

// @ts-ignore
authenticator.use(keycloakServer)

export async function requireUserSession(request: Request) {
  // get the session
  const cookie = request.headers.get('cookie')
  const session = await getSession(cookie)
  if (session.get('targetURL')) {
    throw redirect(session.get('targetURL'), { headers: { 'Set-Cookie': await commitSession(session) } })
  }
  // validate the session, `userId` is just an example, use whatever value you
  // put in the session when the user authenticated
  if (!session.has(authenticator.sessionKey)) {
    // if there is no user session, redirect to login
    session.flash('targetURL', request.url)
    throw redirect('/login', { headers: { 'Set-Cookie': await commitSession(session) } })
  }

  return session
}

