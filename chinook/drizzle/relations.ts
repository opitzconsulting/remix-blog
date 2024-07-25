import { relations } from "drizzle-orm/relations";
import { artistInChinook, albumInChinook, employeeInChinook, customerInChinook, invoiceInChinook, invoice_lineInChinook, trackInChinook, genreInChinook, media_typeInChinook, playlistInChinook, playlist_trackInChinook } from "./schema";

export const albumInChinookRelations = relations(albumInChinook, ({one, many}) => ({
	artistInChinook: one(artistInChinook, {
		fields: [albumInChinook.artist_id],
		references: [artistInChinook.artist_id]
	}),
	trackInChinooks: many(trackInChinook),
}));

export const artistInChinookRelations = relations(artistInChinook, ({many}) => ({
	albumInChinooks: many(albumInChinook),
}));

export const employeeInChinookRelations = relations(employeeInChinook, ({one, many}) => ({
	employeeInChinook: one(employeeInChinook, {
		fields: [employeeInChinook.reports_to],
		references: [employeeInChinook.employee_id],
		relationName: "employeeInChinook_reports_to_employeeInChinook_employee_id"
	}),
	employeeInChinooks: many(employeeInChinook, {
		relationName: "employeeInChinook_reports_to_employeeInChinook_employee_id"
	}),
	customerInChinooks: many(customerInChinook),
}));

export const customerInChinookRelations = relations(customerInChinook, ({one, many}) => ({
	employeeInChinook: one(employeeInChinook, {
		fields: [customerInChinook.support_rep_id],
		references: [employeeInChinook.employee_id]
	}),
	invoiceInChinooks: many(invoiceInChinook),
}));

export const invoice_lineInChinookRelations = relations(invoice_lineInChinook, ({one}) => ({
	invoiceInChinook: one(invoiceInChinook, {
		fields: [invoice_lineInChinook.invoice_id],
		references: [invoiceInChinook.invoice_id]
	}),
	trackInChinook: one(trackInChinook, {
		fields: [invoice_lineInChinook.track_id],
		references: [trackInChinook.track_id]
	}),
}));

export const invoiceInChinookRelations = relations(invoiceInChinook, ({one, many}) => ({
	invoice_lineInChinooks: many(invoice_lineInChinook),
	customerInChinook: one(customerInChinook, {
		fields: [invoiceInChinook.customer_id],
		references: [customerInChinook.customer_id]
	}),
}));

export const trackInChinookRelations = relations(trackInChinook, ({one, many}) => ({
	invoice_lineInChinooks: many(invoice_lineInChinook),
	albumInChinook: one(albumInChinook, {
		fields: [trackInChinook.album_id],
		references: [albumInChinook.album_id]
	}),
	genreInChinook: one(genreInChinook, {
		fields: [trackInChinook.genre_id],
		references: [genreInChinook.genre_id]
	}),
	media_typeInChinook: one(media_typeInChinook, {
		fields: [trackInChinook.media_type_id],
		references: [media_typeInChinook.media_type_id]
	}),
	playlist_trackInChinooks: many(playlist_trackInChinook),
}));

export const genreInChinookRelations = relations(genreInChinook, ({many}) => ({
	trackInChinooks: many(trackInChinook),
}));

export const media_typeInChinookRelations = relations(media_typeInChinook, ({many}) => ({
	trackInChinooks: many(trackInChinook),
}));

export const playlist_trackInChinookRelations = relations(playlist_trackInChinook, ({one}) => ({
	playlistInChinook: one(playlistInChinook, {
		fields: [playlist_trackInChinook.playlist_id],
		references: [playlistInChinook.playlist_id]
	}),
	trackInChinook: one(trackInChinook, {
		fields: [playlist_trackInChinook.track_id],
		references: [trackInChinook.track_id]
	}),
}));

export const playlistInChinookRelations = relations(playlistInChinook, ({many}) => ({
	playlist_trackInChinooks: many(playlist_trackInChinook),
}));
