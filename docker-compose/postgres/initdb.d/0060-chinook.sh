#!/bin/bash
psql -v ON_ERROR_STOP=1 --username chinook_admin -d "chinook" < /docker-entrypoint-initdb.d/0060-chinook.sql.dmp
psql -v ON_ERROR_STOP=1 --username chinook_admin -d "chinook" < /docker-entrypoint-initdb.d/0061-chinook-sequences.sql.update
psql -v ON_ERROR_STOP=1 --username chinook_admin -d "chinook" < /docker-entrypoint-initdb.d/0062-chinook-views.sql.create
psql -v ON_ERROR_STOP=1 --username chinook_admin -d "chinook" < /docker-entrypoint-initdb.d/0063-additional-tables.sql.create
