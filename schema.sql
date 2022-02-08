

DROP TABLE IF EXISTS myfavmovietable;

CREATE TABLE IF NOT EXISTS myfavmovietable (

 id SERIAL PRIMARY KEY,
title VARCHAR(255),
release_date VARCHAR(255),
vote_average VARCHAR(255),
overview VARCHAR(255)

);

