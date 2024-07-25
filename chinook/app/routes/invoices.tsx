import {json, type LoaderFunctionArgs} from "@remix-run/node";
import {useLoaderData} from "@remix-run/react";
import {eq} from "drizzle-orm";
import {InvoiceTable} from "~/components/InvoiceTable";
import {db} from "~/db.server";
import {invoice_viewInChinook} from "../../drizzle/schema";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const { searchParams } = new URL(request.url);
	const customerId = searchParams.get("customerId");
	const invoices = await db
		.select()
		.from(invoice_viewInChinook)
		.where(
			customerId
				? eq(invoice_viewInChinook.customer_id, Number.parseInt(customerId))
				: undefined,
		);
	return json({ invoices });
};

export default function Invoices() {
	const { invoices } = useLoaderData<typeof loader>();
	return (
		<>
			<h1>Invoices</h1>
			<InvoiceTable invoices={invoices} />
		</>
	);
}
