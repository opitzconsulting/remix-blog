import {type LoaderFunction, redirect} from '@remix-run/node';
import {commitSession, destroySession, getSession} from '~/services/session.server';

export const loader: LoaderFunction = async ({ request }) => {
    const cookie = request.headers.get('cookie')
    const session = await getSession(cookie);
    return redirect('/', { headers: { 'Set-Cookie': await destroySession(session) } }) ;
}
