-- Drop and recreate maps table (Example)

DROP TABLE IF EXISTS maps CASCADE;

CREATE TABLE maps(
  id SERIAL PRIMARY KEY NOT NULL,
  owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description VARCHAR(255),
  image TEXT DEFAULT 'https://images.unsplash.com/photo-1536431311719-398b6704d4cc?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1534&q=80',
  date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
