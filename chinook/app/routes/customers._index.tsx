import { ActionIcon, Box, Button, Group, Text } from "@mantine/core";
import { type LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useNavigate } from "@remix-run/react";
import { IconEdit, IconInvoice, IconTrash } from "@tabler/icons-react";
import { createSelectSchema } from "drizzle-zod";
import {
	type MRT_ColumnDef,
	MantineReactTable,
	useMantineReactTable,
} from "mantine-react-table";
import { useMemo } from "react";
import type { z } from "zod";
import { db } from "~/db.server";
import { customer_viewInChinook } from "../../drizzle/schema";

const CustomerSchema = createSelectSchema(customer_viewInChinook);
type Customer = z.infer<typeof CustomerSchema>;

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const customers = await db.query.customer_viewInChinook.findMany();
	return json({ customers });
};

export default function Customers_index() {
	const { customers } = useLoaderData<typeof loader>();
	const columns = useMemo<MRT_ColumnDef<Customer>[]>(
		() => [
			{
				accessorKey: "customer_name",
				header: "Customer Name",
			},
			{
				accessorKey: "company",
				header: "Company",
			},
			{
				accessorKey: "email",
				header: "Email",
			},
			{
				accessorKey: "support_rep_name",
				header: "Support Rep",
			},
		],
		[],
	);
	const table = useMantineReactTable({
		columns,
		data: customers,
		initialState: {
			pagination: {
				pageSize: 10,
				pageIndex: 0,
			},
			density: "xs",
		},
		renderDetailPanel: ({ row }) => (
			<Box
				style={{
					display: "grid",
					margin: "auto",
					gridTemplateColumns: "1fr 1fr",
					width: "50%",
				}}
			>
				<Text>Address: {row.original.address}</Text>
				<Text>City: {row.original.city}</Text>
				<Text>Postal Code: {row.original.postal_code}</Text>
				<Text>State: {row.original.state}</Text>
				<Text>Country: {row.original.country}</Text>
				<Text>Fax: {row.original.fax}</Text>
				<Text>Phone: {row.original.phone}</Text>
			</Box>
		),
		renderTopToolbarCustomActions: ({ table }) => {
			return (
				<Button component={Link} to={"/customers/create"}>
					Create Customer
				</Button>
			);
		},
		enableRowActions: true,
		positionActionsColumn: "last",
		renderRowActions: ({ row }) => {
			return (
				<Group grow>
					<ActionIcon
						component={Link}
						to={`/customers/edit/${row.original.customer_id}`}
						prefetch={"intent"}
						aria-label={`Edit ${row.original.customer_name}`}
					>
						<IconEdit />
					</ActionIcon>
					<ActionIcon
						component={Link}
						to={`/customers/delete/${row.original.customer_id}`}
						prefetch={"intent"}
						aria-label={`Delete ${row.original.customer_name}`}
					>
						<IconTrash />
					</ActionIcon>
					<ActionIcon
						component={Link}
						to={`/invoices?customerId=${row.original.customer_id}`}
						prefetch={"intent"}
						aria-label={`View Invoices for ${row.original.customer_name}`}
					>
						<IconInvoice />
					</ActionIcon>
				</Group>
			);
		},
		defaultColumn: {
			maxSize: 300,
			minSize: 80,
			size: 80,
		},
	});
	return (
		<div>
			<p>This is the page where you can view all the customers.</p>
			<MantineReactTable table={table}/>
			<Outlet/>
		</div>
	);
}
