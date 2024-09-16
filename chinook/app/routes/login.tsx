// app/routes/login.tsx
import type {LoaderFunctionArgs} from "@remix-run/router";
import {authenticator} from "~/services/auth.server";
import {getSession} from '~/services/session.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const session = await getSession(
		request.headers.get("cookie"),
	);
	const targetURL = session.get("targetURL");
	return authenticator.authenticate("keycloak", request, {
		successRedirect: targetURL || "/protected",
		failureRedirect: "/",
	});
};
