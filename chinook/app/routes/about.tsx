import type {LoaderFunction} from '@remix-run/node';

export const loader : LoaderFunction = async () => {
    return null;
}

export default function About() {
    return (
        <div>
            <h1>About</h1>
            <p>This is a Remix app with Keycloak authentication.</p>
            <p>It is a starting point for your remix apps</p>
        </div>
    );
}
