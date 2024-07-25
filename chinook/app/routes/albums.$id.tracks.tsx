import {db} from '~/db.server';
import {asc, eq} from 'drizzle-orm';
import {json, LoaderFunctionArgs} from '@remix-run/node';
import {album_tracksInChinook} from '../../drizzle/schema';
import {useLoaderData, useRouteError} from '@remix-run/react';
import {MantineReactTable, MRT_ColumnDef, useMantineReactTable} from 'mantine-react-table';
import {useMemo} from 'react';
import {createSelectSchema} from "drizzle-zod";
import {z} from 'zod';

const AlbumTrackSchema = createSelectSchema(album_tracksInChinook);
type AlbumTrack = z.infer<typeof AlbumTrackSchema>;

export const loader = async ({request, params}: LoaderFunctionArgs) => {
    const tracks = await db.query.album_tracksInChinook.findMany({
        where: eq(album_tracksInChinook.album_id, Number.parseInt(params.id || '0')),
    })
    const album = await db.query.album_tracksInChinook.findFirst({
        where: eq(album_tracksInChinook.album_id, Number.parseInt(params.id || '0')),
        orderBy: [asc(album_tracksInChinook.track_id)],
    })
    return json({tracks, album});
}
export default function Tracks() {
    const {tracks, album} = useLoaderData<typeof loader>();
    const columns = useMemo<MRT_ColumnDef<AlbumTrack>[]>(() => [
        {
            accessorKey: 'track_id',
            header: 'Track ID',
        },
        {
            accessorKey: 'track_name',
            header: 'Name',
        },
        {
            accessorKey: 'genre_name',
            header: 'Genre',
        },
        {
            accessorKey: 'milliseconds', header: 'Length',
            Cell: ({row}) => {
                const value = row.getValue<number>('milliseconds')
                const seconds = Math.floor((value || 0) / 1000);
                const minutes = Math.floor(seconds / 60);
                return `${minutes}:${("00" + seconds % 60).slice(-2)}`;
            }
        },
    ], [])
    const table = useMantineReactTable({
        columns,
        data: tracks,
        enableGlobalFilter: false,
        enableDensityToggle: false,
        enableHiding: false,
        enableFilters: false,
        enableFullScreenToggle: false,
    })
    return <>
        <h1 id={"tracks"}>{album?.album_title}</h1>
        <div>{album?.artist_name}</div>
        <div>{tracks.length} tracks</div>
        <MantineReactTable table={table}/>
    </>
}

export function ErrorBoundary() {
    const error = useRouteError()
    console.log(error)
    return <div>
        <h1>Nothing to Display</h1>
    </div>
}
