import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import {
	customer_viewInChinook,
	sales_agent_viewInChinook,
} from "../../drizzle/schema";

export const salesAgentSchema = createSelectSchema(sales_agent_viewInChinook);
export type SalesAgent = z.infer<typeof salesAgentSchema>;

export const customerCreateForm = z.object({
	first_name: z.string().min(1).max(40),
	last_name: z.string().min(1).max(20),
	address: z.string().min(1).max(70),
	city: z.string().min(1).max(40),
	state: z.string().max(40).nullish(),
	country: z.string().min(1).max(40),
	postal_code: z.string().min(1).max(10),
	phone: z.string().min(3).max(24),
	email: z.string().min(3).max(60).email(),
});
export type CustomerCreateForm = z.infer<typeof customerCreateForm>;

export const customerUpdateForm = customerCreateForm.extend({
	customer_id: z.number(),
	company: z.string().max(80).nullish(),
	fax: z.string().max(24).nullish(),
	support_rep_id: z.number().nullish(),
});

export type CustomerUpdateForm = z.infer<typeof customerUpdateForm>;

export const customerViewSchema = createSelectSchema(customer_viewInChinook);
export type Customer = z.infer<typeof customerViewSchema>;
