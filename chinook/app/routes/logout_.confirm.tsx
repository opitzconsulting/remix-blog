import type {LoaderFunction} from '@remix-run/node';
import {json, useLoaderData} from '@remix-run/react';
import {Link} from '@remix-run/react';

export const loader: LoaderFunction = async ({ request }) => {
    const keycloakLogoutUrl = process.env.LOGOUT_URL;
    return json({ keycloakLogoutUrl });
}

export default function Index() {
    const { keycloakLogoutUrl } = useLoaderData<typeof loader>();

    return (
        <div>
            <h1>Logout Confirm</h1>
            <p>You have been logged out of this app. You might still be signed in globally.</p>
            <p>If you access a secured page, you might not notice that you are directly logged in again via Single-Sign-On</p>
            <p>If you really want to log out, click the link below.</p>
            {keycloakLogoutUrl && <Link to={keycloakLogoutUrl}>Logout from Keycloak</Link>}
        </div>
    );
}
