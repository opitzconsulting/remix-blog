import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "drizzle/schema";
import pg from "pg";
import {Kysely, ParseJSONResultsPlugin, PostgresDialect} from 'kysely';
import type {DB} from 'kysely-codegen';

const { Pool } = pg;

const pool = new Pool({
	connectionString:
		"postgres://chinook_admin:chinook_admin@127.0.0.1:5432/chinook",
});

export const db = drizzle(pool, { schema });

export const kysely = new Kysely<DB>({
	dialect: new PostgresDialect({
		pool: pool,
	}),
	plugins: [new ParseJSONResultsPlugin()],
	log: ['query', 'error'],
})
