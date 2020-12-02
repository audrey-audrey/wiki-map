-- Drop and recreate maps table (Example)

DROP TABLE IF EXISTS maps CASCADE;

CREATE TABLE maps(
  id SERIAL PRIMARY KEY NOT NULL,
  owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description VARCHAR(255),
  image VARCHAR(255),
  date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
