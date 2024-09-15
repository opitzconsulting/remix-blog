// app/routes/login.tsx
import type {LoaderFunctionArgs} from '@remix-run/router'
import {authenticator} from '~/services/auth.server'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return authenticator.authenticate('keycloak', request, {

  })
  return authenticator.authenticate('keycloak', request, {
    successRedirect: '/',
    failureRedirect: '/error'
  })
}
