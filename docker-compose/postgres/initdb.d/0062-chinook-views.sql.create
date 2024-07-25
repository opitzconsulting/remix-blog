DROP VIEW IF EXISTS album_tracks;
CREATE OR REPLACE VIEW album_tracks AS
(
SELECT album.title        AS album_title,
       artist.name        AS artist_name,
       track.name         AS track_name,
       genre.name         AS genre_name,
       track.milliseconds AS milliseconds,
       album.album_id,
       artist.artist_id,
       track.track_id,
       genre.genre_id
FROM album
         JOIN track ON album.album_id = track.album_id
         JOIN artist ON album.artist_id = artist.artist_id
         JOIN genre ON track.genre_id = genre.genre_id

    );
ALTER VIEW album_tracks OWNER TO chinook_admin;

DROP VIEW IF EXISTS invoice_line_view;
CREATE OR REPLACE VIEW invoice_line_view AS
(
SELECT *, quantity * unit_price AS price
FROM (SELECT invoice_line_id, track.name AS track_name, quantity, track.unit_price, invoice.invoice_id
      FROM invoice
               LEFT OUTER JOIN invoice_line ON invoice.invoice_id = invoice_line.invoice_id
               JOIN track ON invoice_line.track_id = track.track_id) AS partial_invoice_line);
ALTER VIEW invoice_line_view OWNER TO chinook_admin;

DROP VIEW IF EXISTS album_view;
CREATE OR REPLACE VIEW album_view AS
(
SELECT album.title,
       artist.name                         AS artist,
       count(track.track_id)               AS number_of_tracks,
       sum(track.milliseconds)             AS length_milliseconds,
       sum(track.milliseconds) / 1000      AS length_seconds,
       sum(track.milliseconds) / 1000 / 60 AS length_minutes,
       artist.artist_id,
       album.album_id
FROM album
         JOIN artist ON album.artist_id = artist.artist_id
         JOIN track ON album.album_id = track.album_id
         JOIN genre ON track.genre_id = genre.genre_id
GROUP BY album.album_id, album.title, artist.name, artist.artist_id
    );
ALTER VIEW album_view OWNER TO chinook_admin;

DROP VIEW IF EXISTS invoice_view;
CREATE OR REPLACE VIEW invoice_view AS
(
SELECT invoice.invoice_id,
       invoice.invoice_date,
       customer.first_name || ' ' || customer.last_name AS customer_name,
       customer.customer_id                             AS customer_id,
       invoice.total                                    AS total,
       billing_address,
       billing_postal_code,
       billing_city,
       billing_state,
       billing_country
FROM invoice
         JOIN customer ON invoice.customer_id = customer.customer_id);
ALTER VIEW invoice_view OWNER TO chinook_admin;

DROP VIEW IF EXISTS customer_view;
CREATE OR REPLACE VIEW customer_view AS
(
SELECT customer.first_name || ' ' || customer.last_name AS customer_name,
       customer.first_name,
       customer.last_name,
       customer.company,
       customer.address,
       customer.city,
       customer.state,
       customer.country,
       customer.postal_code,
       customer.phone,
       customer.fax,
       customer.email,
       employee.first_name || ' ' || employee.last_name AS support_rep_name,
       customer.support_rep_id,
       customer.customer_id
FROM customer
         LEFT OUTER JOIN employee ON customer.support_rep_id = employee.employee_id
    );
ALTER VIEW customer_view OWNER TO chinook_admin;

DROP VIEW IF EXISTS sales_agent_view;
CREATE OR REPLACE VIEW sales_agent_view AS
(
SELECT first_name || ' ' || employee.last_name AS name,
       first_name,
       last_name,
       phone,
       email,
       fax,
       employee_id
FROM employee
WHERE title = 'Sales Support Agent');
ALTER VIEW sales_agent_view OWNER TO chinook_admin;
