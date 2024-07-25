import {Outlet} from '@remix-run/react';

export const loader = async () => {
    return null;
}

export default function Index() {
    return (
        <div>
            <h1>Customers</h1>
            <Outlet/>
        </div>
    );
}
