import { createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { invoice_viewInChinook } from "../../drizzle/schema";

const InvoiceSchema = createSelectSchema(invoice_viewInChinook);
export type Invoice = z.infer<typeof InvoiceSchema>;
