-- Drop and recreate pins table (Example)

DROP TABLE IF EXISTS pins CASCADE;

CREATE TABLE pins (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  lat DECIMAL(10, 8) NOT NULL,
  lng DECIMAL(11, 8) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  image VARCHAR(255),
  date_created TIMESTAMP,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  map_id INTEGER REFERENCES maps(id) ON DELETE CASCADE
);
