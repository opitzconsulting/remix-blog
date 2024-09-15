import type {LoaderFunction} from '@remix-run/node';
import {requireUserSession} from '~/services/auth.server';

export const loader: LoaderFunction = async ({ request }) => {
    await requireUserSession(request);
    return null;
}

export default function Index() {
    return (
        <div>
            <h1>Default Protected Route</h1>
            <p>This route is protected.</p>
        </div>
    );
}
