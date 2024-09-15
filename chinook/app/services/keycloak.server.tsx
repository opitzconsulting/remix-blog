import {type KeycloakProfile, KeycloakStrategy} from 'remix-keycloak'
import type {RolesProfile} from '~/services/auth.server'

export const kcConfig = {
	useSSL:
		process.env.KEYCLOAK_USE_SSL !== undefined
			? process.env.KEYCLOAK_USE_SSL.toLowerCase() === "true"
			: undefined,
	domain: process.env.KEYCLOAK_DOMAIN ?? "keycloak.domain.not.set",
	realm: process.env.KEYCLOAK_REALM ?? "realm.not.set",
	clientID: process.env.CLIENT_ID ?? "client.id.not.set",
	clientSecret: process.env.CLIENT_SECRET ?? "client.secret.not.set",
	callbackURL: process.env.CALLBACK_URL ?? "https://callback.url.not.set",
	logoutURL: process.env.LOGOUT_URL ?? "https://logout.url.not.set",
};

export default new KeycloakStrategy(
	kcConfig,
	async ({ profile, refreshToken, accessToken }) => {
		const keycloakProfile = profile as KeycloakProfile & RolesProfile;
		const realmRoles = keycloakProfile._json.realm_access?.roles ?? [];
		const clientRoles =
			keycloakProfile._json.resource_access?.[kcConfig.clientID]?.roles ?? [];
		return {
			profile,
			refreshToken,
			accessToken,
			roles: [...realmRoles, ...clientRoles],
		};
	},
);
