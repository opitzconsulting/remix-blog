import { Button, Stack, Text } from "@mantine/core";
import {
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
	json,
	redirect,
} from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { eq, inArray } from "drizzle-orm";
import { InvoiceTable } from "~/components/InvoiceTable";
import { db } from "~/db.server";
import {
	customerInChinook,
	customer_viewInChinook,
	invoiceInChinook,
	invoice_lineInChinook,
	invoice_viewInChinook,
} from "../../drizzle/schema";

export const loader = async ({ params }: LoaderFunctionArgs) => {
	if (params.id === undefined) {
		return new Response("Missing id", { status: 400 });
	}
	const customer = await db.query.customer_viewInChinook.findFirst({
		where: eq(customer_viewInChinook.customer_id, Number.parseInt(params.id)),
	});
	const invoices = await db.query.invoice_viewInChinook.findMany({
		where: eq(invoice_viewInChinook.customer_id, Number.parseInt(params.id)),
	});
	return json({ customer, invoices });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
	if (params.id === undefined) {
		return new Response("Missing id", { status: 400 });
	}
	if (request.method === "DELETE") {
		const customerId = Number.parseInt(params.id);
		await db.transaction(async (tx) => {
			const invoices = await tx.query.invoiceInChinook.findMany({
				where: eq(invoiceInChinook.customer_id, customerId),
			});
			await tx.delete(invoice_lineInChinook).where(
				inArray(
					invoice_lineInChinook.invoice_id,
					invoices.map((i) => i.invoice_id),
				),
			);
			await tx
				.delete(invoiceInChinook)
				.where(eq(invoiceInChinook.customer_id, customerId));
			await tx
				.delete(customerInChinook)
				.where(eq(customerInChinook.customer_id, customerId));
		});
	}
	return redirect("/customers");
};

export default function CustomerDelete() {
	const { customer, invoices } = useLoaderData<typeof loader>();
	return (
		<div>
			<p>
				Are you sure you want to delete{" "}
				<Text fw={700} ta={"center"}>
					{customer.customer_name}&nbsp;?
				</Text>
			</p>
			<p>This would also delete the customer's invoices.</p>
			<Stack>
				<Form method="delete">
					<Button type="submit" color={"red"}>
						Delete
					</Button>
				</Form>
				<InvoiceTable
					invoices={invoices}
					initialState={{
						pagination: { pageSize: 5, pageIndex: 0 },
						sorting: [{ id: "invoice_date", desc: true }],
					}}
				/>
			</Stack>
		</div>
	);
}
