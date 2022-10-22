/*
Execute this file from the command line by typing:
  psql postgres < db/schema/schema.sql
*/

DROP DATABASE IF EXISTS encompass;
CREATE DATABASE encompass;

\c encompass;

CREATE EXTENSION citext;
CREATE EXTENSION pgcrypto;

CREATE TABLE users (
  user_id SERIAL,
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL,
  email CITEXT UNIQUE NOT NULL,
  gmail CITEXT UNIQUE,
  password TEXT,

  PRIMARY KEY (user_id),
  CONSTRAINT chk_firstName
    CHECK(char_length(firstName) <= 20),
  CONSTRAINT chk_lastName
    CHECK(char_length(lastName) <= 20)
);

CREATE TABLE categories (
  category_id SERIAL,
  category CITEXT,
  user_id INT,
  color VARCHAR(7),

  PRIMARY KEY (category_id),
  CONSTRAINT chk_category
    CHECK (char_length(category) <= 30),
  CONSTRAINT fk_user
    FOREIGN KEY (user_id)
      REFERENCES users(user_id),
  UNIQUE (user_id, category),
  UNIQUE (user_id, color)
);

CREATE TABLE todos (
  todo_id SERIAL,
  user_id INT,
  task TEXT NOT NULL,
  description TEXT,
  category_id INT,
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  completed BOOLEAN DEFAULT FALSE,
  appointment BOOLEAN DEFAULT FALSE,

  PRIMARY KEY (todo_id),
  CONSTRAINT fk_user
    FOREIGN KEY (user_id)
      REFERENCES users(user_id),
  CONSTRAINT fk_category
    FOREIGN KEY (category_id)
      REFERENCES categories(category_id),
  CONSTRAINT chk_task
    CHECK (char_length(task) <= 100)
);

-- Load some preliminary data

\COPY users FROM './db/schema/users.csv' DELIMITER ',' CSV HEADER;
\COPY categories FROM './db/schema/categories.csv' DELIMITER ',' CSV HEADER;
\COPY todos FROM './db/schema/todos.csv' DELIMITER ',' CSV HEADER;
