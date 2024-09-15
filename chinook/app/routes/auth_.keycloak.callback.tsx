import type { LoaderFunctionArgs } from '@remix-run/node'
import { authenticator } from '~/services/auth.server'
import { sessionStorage } from '~/services/session.server'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await sessionStorage.getSession(request.headers.get('cookie'))
  const targetURL = session.get('targetURL')
  await sessionStorage.commitSession(session) // required to remove flash value
  return authenticator.authenticate('keycloak', request, {
    successRedirect: targetURL || '/protected',
    failureRedirect: '/login',
  })
}
