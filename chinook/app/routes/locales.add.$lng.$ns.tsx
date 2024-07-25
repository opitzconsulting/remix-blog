import type { ActionFunctionArgs } from "@remix-run/node";
import { sql } from "drizzle-orm";
import { db } from "~/db.server";
import { missing_translationsInChinook } from "../../drizzle/schema";

export const action = async ({ request, params }: ActionFunctionArgs) => {
	const { lng, ns } = params;
	const body = await request.text();
	const parsedBody = JSON.parse(body);
	for (const key of Object.keys(parsedBody)) {
		await db
			.insert(missing_translationsInChinook)
			.values({
				language: lng ?? "unknown",
				namespace: ns ?? "unknown",
				key: key,
				default_value: parsedBody[key],
			})
			.onConflictDoUpdate({
				target: [
					missing_translationsInChinook.language,
					missing_translationsInChinook.namespace,
					missing_translationsInChinook.key,
				],
				set: {
					reported_at: sql`CURRENT_TIMESTAMP`,
				},
			});
	}
	console.log(parsedBody);
	return null;
};
