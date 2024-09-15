import type { KeycloakProfile } from 'remix-keycloak'
import type { RolesProfile } from '~/services/auth.server'

export type UserProfile = {
  id: string
  displayName: string
  email: string
  roles: string[]
}

export type KeycloakAuthProps = {
  profile: KeycloakProfile & RolesProfile
  accessToken: string
  refreshToken?: string
  roles: string[]
}
