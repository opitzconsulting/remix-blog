import type { KeycloakAuthProps, UserProfile } from '~/models/auth'

export const userService = (user?: KeycloakAuthProps) => {
  const { profile, accessToken, refreshToken, roles } = user ?? {
    profile: {},
    accessToken: '',
    refreshToken: '',
    roles: [],
  }
  const userProfile: UserProfile = {
    id: profile?.id ?? '',
    displayName: profile?.displayName ?? '',
    email: profile?.emails?.[0]?.value ?? '',
    roles: roles,
  }
  const isAuthenticated = !!profile?.id
  const hasRole = (role: string) => userProfile.roles?.includes(role)
  const hasAnyRole = user ? (roles: string[]) => roles.some((role) => hasRole(role)) : () => false
  return {
    userProfile,
    accessToken,
    refreshToken,
    roles,
    isAuthenticated,
    hasRole,
    hasAnyRole,
  }
}
