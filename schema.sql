
DROP TABLE IF EXISTS MyFavMovietable;

CREATE TABLE IF NOT EXISTS MyFavMovietable (
 id SERIAL PRIMARY KEY,
title VARCHAR(255),
release_date VARCHAR(255),
vote_average VARCHAR(255),
overview VARCHAR(1000)
);