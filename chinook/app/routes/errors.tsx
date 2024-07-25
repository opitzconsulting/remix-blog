import {isRouteErrorResponse, Outlet, useRouteError} from '@remix-run/react';

export default function Errors() {
    return (
        <>
            <h1>Error Scenarios</h1>
            <Outlet />
        </>
    );
}
export function ErrorBoundary() {
    const error = useRouteError();
    if (isRouteErrorResponse(error)) {
        return (
            <div>
                <h1>
                    Errors Route ErrorBoundary: {error.status} {error.statusText}
                </h1>
                <p>{error.data}</p>
            </div>
        );
    } else if (error instanceof Error) {
        return (
            <div>
                <h1>Errors Route Error Boundary: Errors / Loader</h1>
                <p>{error.message}</p>
                <p>The stack trace is:</p>
                <pre>{error.stack}</pre>
            </div>
        );
    } else {
        return <h1>Unknown Error</h1>;
    }
}
