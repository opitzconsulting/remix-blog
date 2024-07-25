import {json, type LoaderFunctionArgs} from "@remix-run/node";
import {isRouteErrorResponse, Outlet, useLoaderData, useNavigate, useRouteError} from "@remix-run/react";
import {createSelectSchema} from "drizzle-zod";
import {useState} from "react";
import type {z} from "zod";
import {db} from "~/db.server";
import {album_viewInChinook} from "../../drizzle/schema";
import {Select} from '@mantine/core';

const AlbumViewSchema = createSelectSchema(album_viewInChinook);
type AlbumView = z.infer<typeof AlbumViewSchema>;

export const loader = async ({request}: LoaderFunctionArgs) => {
    const albums = await db.query.album_viewInChinook.findMany();
    return json({albums});
};

export default function Albums() {
    const {albums} = useLoaderData<typeof loader>();
    const navigate = useNavigate();

    function getAlbum(selectedAlbum: string | null): AlbumView | undefined {
        return albums.find((album) => album.album_id === parseInt(selectedAlbum || '0'));
    }

    const groupBy = <T, K extends keyof any>(arr: T[], key: (i: T) => K) =>
        arr.reduce((groups, item) => {
            (groups[key(item)] ||= []).push(item);
            return groups;
        }, {} as Record<K, T[]>);

    const groupedAlbums = groupBy(albums, a => a.artist || 'Unknown');
    const comboBoxData = Object.keys(groupedAlbums).map((artist) => ({
        group: artist,
        items: groupedAlbums[artist].map((album) => ({
            label: album.title || 'Unknown',
            value: String(album.album_id),
        }))
    }));

    const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);

    return (
        <>
            <h1>Albums</h1>

            <Select data={[...comboBoxData]} name={"album"} value={selectedAlbum}
                    placeholder={"Pick an album"} searchable
                    onChange={(value) => {
                        setSelectedAlbum(value)
                        getAlbum(value) ? navigate(`/albums/${getAlbum(value)?.album_id}/tracks`) : navigate(`/albums`)
                    }}
                    label={"Albums"}
                    nothingFoundMessage={"No albums found..."}
                    clearable
                    aria-label={"Select Albums"}
            />
            <Outlet/>
        </>
    );
}

export function ErrorBoundary2() {
    const error = useRouteError();
    if (isRouteErrorResponse(error)) {
        return (
            <div>
                <h1>
                    {error.status} {error.statusText}
                </h1>
                <p>{error.data}</p>
            </div>
        );
    } else if (error instanceof Error) {
        return (
            <div>
                <h1>Error from Album-ErrorBoundary</h1>
                <p>{error.message}</p>
                <p>The stack trace is:</p>
                <pre>{error.stack}</pre>
            </div>
        );
    } else {
        return <h1>Unknown Error</h1>;
    }
}
