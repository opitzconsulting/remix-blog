import type {LoaderFunction} from '@remix-run/node';
import {requireUserSession} from '~/services/auth.server';

export const loader: LoaderFunction = async ({ request }) => {
    const session = await requireUserSession(request);
    return null;
}

export default function Index() {
    return (
        <div>
            <h1>Secured Route</h1>
            <p>This route is protected.</p>
        </div>
    );
}
