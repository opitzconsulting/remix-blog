import {LoaderFunctionArgs} from '@remix-run/node';
import {NavLink} from '@remix-run/react';

export const loader = async ({ request }:LoaderFunctionArgs) => {
    return null;
}

export default function Errors() {
    return <>
        <p>Testing various scenarios and error boundaries</p>
        <ul>
            <li>
            <NavLink to={'/errors/loader'}>Loader Error: handled by this route error boundary</NavLink>
            </li>
            <li>
            <NavLink to={'/errors/root'}>Not Nested Layout: handled by root error boundary</NavLink>
            </li>
        </ul>
    </>
}
