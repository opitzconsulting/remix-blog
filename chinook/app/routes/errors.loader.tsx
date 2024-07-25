import {LoaderFunctionArgs} from '@remix-run/node';

export const loader = async ({ request }: LoaderFunctionArgs) => {
    throw new Error('Something went wrong');
}

export default function Errors() {
    return (
        <div>
            <h1>Errors</h1>
            <p>Something went wrong</p>
        </div>
    );
}
