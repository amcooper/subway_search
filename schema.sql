DROP TABLE IF EXISTS addresses;
CREATE TABLE addresses (
  id INTEGER PRIMARY KEY,
  user_id INTEGER REFERENCES users
  name TEXT,
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER addresses_trigger BEFORE UPDATE ON addresses BEGIN
  UPDATE addresses SET updated_at = CURRENT_TIMESTAMP WHERE id = new.id;
END;

DROP TABLE IF EXISTS users;
CREATE TABLE users (
          id INTEGER PRIMARY KEY,
          username TEXT,
          password TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER users_trigger BEFORE UPDATE ON users BEGIN
  UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = new.id;
END;