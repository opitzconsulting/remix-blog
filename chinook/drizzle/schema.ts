import { pgTable, pgSchema, serial, varchar, index, foreignKey, integer, timestamp, numeric, bigint, text, primaryKey } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"

export const chinook = pgSchema("chinook");


export const artistInChinook = chinook.table("artist", {
	artist_id: serial("artist_id").primaryKey().notNull(),
	name: varchar("name", { length: 120 }),
});

export const albumInChinook = chinook.table("album", {
	album_id: serial("album_id").primaryKey().notNull(),
	title: varchar("title", { length: 160 }).notNull(),
	artist_id: integer("artist_id").notNull().references(() => artistInChinook.artist_id),
},
(table) => {
	return {
		artist_id_idx: index("album_artist_id_idx").using("btree", table.artist_id),
	}
});

export const employeeInChinook = chinook.table("employee", {
	employee_id: serial("employee_id").primaryKey().notNull(),
	last_name: varchar("last_name", { length: 20 }).notNull(),
	first_name: varchar("first_name", { length: 20 }).notNull(),
	title: varchar("title", { length: 30 }),
	reports_to: integer("reports_to"),
	birth_date: timestamp("birth_date", { mode: 'string' }),
	hire_date: timestamp("hire_date", { mode: 'string' }),
	address: varchar("address", { length: 70 }),
	city: varchar("city", { length: 40 }),
	state: varchar("state", { length: 40 }),
	country: varchar("country", { length: 40 }),
	postal_code: varchar("postal_code", { length: 10 }),
	phone: varchar("phone", { length: 24 }),
	fax: varchar("fax", { length: 24 }),
	email: varchar("email", { length: 60 }),
},
(table) => {
	return {
		reports_to_idx: index("employee_reports_to_idx").using("btree", table.reports_to),
		employee_reports_to_fkey: foreignKey({
			columns: [table.reports_to],
			foreignColumns: [table.employee_id],
			name: "employee_reports_to_fkey"
		}),
	}
});

export const customerInChinook = chinook.table("customer", {
	customer_id: serial("customer_id").primaryKey().notNull(),
	first_name: varchar("first_name", { length: 40 }).notNull(),
	last_name: varchar("last_name", { length: 20 }).notNull(),
	company: varchar("company", { length: 80 }),
	address: varchar("address", { length: 70 }),
	city: varchar("city", { length: 40 }),
	state: varchar("state", { length: 40 }),
	country: varchar("country", { length: 40 }),
	postal_code: varchar("postal_code", { length: 10 }),
	phone: varchar("phone", { length: 24 }),
	fax: varchar("fax", { length: 24 }),
	email: varchar("email", { length: 60 }).notNull(),
	support_rep_id: integer("support_rep_id").references(() => employeeInChinook.employee_id),
},
(table) => {
	return {
		support_rep_id_idx: index("customer_support_rep_id_idx").using("btree", table.support_rep_id),
	}
});

export const invoice_lineInChinook = chinook.table("invoice_line", {
	invoice_line_id: serial("invoice_line_id").primaryKey().notNull(),
	invoice_id: integer("invoice_id").notNull().references(() => invoiceInChinook.invoice_id),
	track_id: integer("track_id").notNull().references(() => trackInChinook.track_id),
	unit_price: numeric("unit_price", { precision: 10, scale:  2 }).notNull(),
	quantity: integer("quantity").notNull(),
},
(table) => {
	return {
		invoice_id_idx: index("invoice_line_invoice_id_idx").using("btree", table.invoice_id),
		track_id_idx: index("invoice_line_track_id_idx").using("btree", table.track_id),
	}
});

export const trackInChinook = chinook.table("track", {
	track_id: serial("track_id").primaryKey().notNull(),
	name: varchar("name", { length: 200 }).notNull(),
	album_id: integer("album_id").references(() => albumInChinook.album_id),
	media_type_id: integer("media_type_id").notNull().references(() => media_typeInChinook.media_type_id),
	genre_id: integer("genre_id").references(() => genreInChinook.genre_id),
	composer: varchar("composer", { length: 220 }),
	milliseconds: integer("milliseconds").notNull(),
	bytes: integer("bytes"),
	unit_price: numeric("unit_price", { precision: 10, scale:  2 }).notNull(),
},
(table) => {
	return {
		album_id_idx: index("track_album_id_idx").using("btree", table.album_id),
		genre_id_idx: index("track_genre_id_idx").using("btree", table.genre_id),
		media_type_id_idx: index("track_media_type_id_idx").using("btree", table.media_type_id),
	}
});

export const playlistInChinook = chinook.table("playlist", {
	playlist_id: serial("playlist_id").primaryKey().notNull(),
	name: varchar("name", { length: 120 }),
});

export const genreInChinook = chinook.table("genre", {
	genre_id: serial("genre_id").primaryKey().notNull(),
	name: varchar("name", { length: 120 }),
});

export const media_typeInChinook = chinook.table("media_type", {
	media_type_id: serial("media_type_id").primaryKey().notNull(),
	name: varchar("name", { length: 120 }),
});

export const invoiceInChinook = chinook.table("invoice", {
	invoice_id: serial("invoice_id").primaryKey().notNull(),
	customer_id: integer("customer_id").notNull().references(() => customerInChinook.customer_id),
	invoice_date: timestamp("invoice_date", { mode: 'string' }).notNull(),
	billing_address: varchar("billing_address", { length: 70 }),
	billing_city: varchar("billing_city", { length: 40 }),
	billing_state: varchar("billing_state", { length: 40 }),
	billing_country: varchar("billing_country", { length: 40 }),
	billing_postal_code: varchar("billing_postal_code", { length: 10 }),
	total: numeric("total", { precision: 10, scale:  2 }).notNull(),
},
(table) => {
	return {
		customer_id_idx: index("invoice_customer_id_idx").using("btree", table.customer_id),
	}
});

export const album_tracksInChinook = chinook.table("album_tracks", {
	album_title: varchar("album_title", { length: 160 }),
	artist_name: varchar("artist_name", { length: 120 }),
	track_name: varchar("track_name", { length: 200 }),
	genre_name: varchar("genre_name", { length: 120 }),
	milliseconds: integer("milliseconds"),
	album_id: integer("album_id"),
	artist_id: integer("artist_id"),
	track_id: integer("track_id"),
	genre_id: integer("genre_id"),
});

export const invoice_line_viewInChinook = chinook.table("invoice_line_view", {
	invoice_line_id: integer("invoice_line_id"),
	track_name: varchar("track_name", { length: 200 }),
	quantity: integer("quantity"),
	unit_price: numeric("unit_price", { precision: 10, scale:  2 }),
	invoice_id: integer("invoice_id"),
	price: numeric("price"),
});

export const album_viewInChinook = chinook.table("album_view", {
	title: varchar("title", { length: 160 }),
	artist: varchar("artist", { length: 120 }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	number_of_tracks: bigint("number_of_tracks", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	length_milliseconds: bigint("length_milliseconds", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	length_seconds: bigint("length_seconds", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	length_minutes: bigint("length_minutes", { mode: "number" }),
	artist_id: integer("artist_id"),
	album_id: integer("album_id"),
});

export const invoice_viewInChinook = chinook.table("invoice_view", {
	invoice_id: integer("invoice_id"),
	invoice_date: timestamp("invoice_date", { mode: 'string' }),
	customer_name: text("customer_name"),
	customer_id: integer("customer_id"),
	total: numeric("total", { precision: 10, scale:  2 }),
	billing_address: varchar("billing_address", { length: 70 }),
	billing_postal_code: varchar("billing_postal_code", { length: 10 }),
	billing_city: varchar("billing_city", { length: 40 }),
	billing_state: varchar("billing_state", { length: 40 }),
	billing_country: varchar("billing_country", { length: 40 }),
});

export const customer_viewInChinook = chinook.table("customer_view", {
	customer_name: text("customer_name"),
	first_name: varchar("first_name", { length: 40 }),
	last_name: varchar("last_name", { length: 20 }),
	company: varchar("company", { length: 80 }),
	address: varchar("address", { length: 70 }),
	city: varchar("city", { length: 40 }),
	state: varchar("state", { length: 40 }),
	country: varchar("country", { length: 40 }),
	postal_code: varchar("postal_code", { length: 10 }),
	phone: varchar("phone", { length: 24 }),
	fax: varchar("fax", { length: 24 }),
	email: varchar("email", { length: 60 }),
	support_rep_name: text("support_rep_name"),
	support_rep_id: integer("support_rep_id"),
	customer_id: integer("customer_id"),
});

export const sales_agent_viewInChinook = chinook.table("sales_agent_view", {
	name: text("name"),
	first_name: varchar("first_name", { length: 20 }),
	last_name: varchar("last_name", { length: 20 }),
	phone: varchar("phone", { length: 24 }),
	email: varchar("email", { length: 60 }),
	fax: varchar("fax", { length: 24 }),
	employee_id: integer("employee_id"),
});

export const playlist_trackInChinook = chinook.table("playlist_track", {
	playlist_id: integer("playlist_id").notNull().references(() => playlistInChinook.playlist_id),
	track_id: integer("track_id").notNull().references(() => trackInChinook.track_id),
},
(table) => {
	return {
		playlist_id_idx: index("playlist_track_playlist_id_idx").using("btree", table.playlist_id),
		track_id_idx: index("playlist_track_track_id_idx").using("btree", table.track_id),
		playlist_track_pkey: primaryKey({ columns: [table.playlist_id, table.track_id], name: "playlist_track_pkey"}),
	}
});

export const missing_translationsInChinook = chinook.table("missing_translations", {
	language: text("language").notNull(),
	namespace: text("namespace").notNull(),
	key: text("key").notNull(),
	default_value: text("default_value"),
	reported_at: timestamp("reported_at", { withTimezone: true, mode: 'string' }).defaultNow(),
},
(table) => {
	return {
		missing_translations_pkey: primaryKey({ columns: [table.language, table.namespace, table.key], name: "missing_translations_pkey"}),
	}
});
