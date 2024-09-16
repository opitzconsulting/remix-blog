// biome-ignore lint/style/useImportType: <explanation>
import {type ActionFunction} from '@remix-run/node';
import {destroySession, getSession} from '~/services/session.server';
import {Form} from '@remix-run/react';
import {authenticator} from '~/services/auth.server';

export const action: ActionFunction = async ({ request }) => {
	const cookie = request.headers.get("cookie");
	const session = await getSession(cookie);
	await authenticator.logout(request, {
		redirectTo: "/logout/confirm",
		headers: { "Set-Cookie": await destroySession(session) },
	});
};

export default function Logout() {
	return (
		<div>
			<Form method={"post"}>
				<button type={"submit"}>Logout</button>
			</Form>
		</div>
	);
}
