require('dotenv').config();
const { Pool } = require('pg');
const { PGHOST, PGUSER, PGDATABASE, PGPASSWORD, PGPORT } = process.env;

const pool = new Pool({
  PGUSER,
  PGHOST,
  PGDATABASE,
  PGPASSWORD,
  PGPORT,
});

const getTodos = function(id) {
  return pool
  .connect()
  .then(client => {
    return client
      .query(`SELECT * FROM todos WHERE user_id=${id}`)
      .then(res => {
        client.release();
        return res.rows;
      })
      .catch(err => {
        client.release();
        console.log(err.stack);
      })
  })
}

const createTodo = function(todo) {
  return pool
  .connect()
  .then(client => {
    return client
      .query(`
      INSERT INTO todos (user_id, task, description, category_id, start_time, end_time, completed, appointment)
      VALUES ('${todo.userID}', '${todo.taskName}', '${todo.description}', '${todo.category}', '${todo.start}', '${todo.end}', '${todo.completed}', '${todo.appointment}')
      returning todo_id`)
      .then(res => {
        client.release();
        return res.rows;
      })
      .catch(err => {
        client.release();
        console.log(err.stack);
      })
  })
}

const deleteTodo = function(todoID) {
  return pool
  .connect()
  .then(client => {
    return client
      .query(`
      DELETE FROM todos WHERE todo_id = ${todoID}
      `)
      .then(res => {
        client.release();
        return res.rows;
      })
      .catch(err => {
        client.release();
        console.log(err.stack);
      })
  })
}

const getCategories = function(id) {
  return pool
  .connect()
  .then(client => {
    return client
      .query(`SELECT * FROM categories WHERE user_id=${id}`)
      .then(res => {
        client.release();
        return res.rows;
      })
      .catch(err => {
        client.release();
        console.log(err.stack);
      })
  })
}

const createCategory = function(category) {
  return pool
  .connect()
  .then(client => {
    return client
      .query(`
      INSERT INTO categories (user_id, category, color)
      VALUES ('${category.userID}', '${category.category}', '${category.color}')
      `)
      .then(res => {
        client.release();
        return res.rows;
      })
      .catch(err => {
        client.release();
        console.log(err.stack);
      })
  })
}

const bookAppointment = function(id) {
  return pool
  .connect()
  .then(client => {
    return client
    .query(`UPDATE todos SET appointment=false WHERE todo_id=${id.selectedEventID}`)
    .then(res => {
      client.release();
      return res.rows;
    })
    .catch(err => {
      client.release();
      console.log(err.stack);
    })
  })
}

const getAppointments = function(id) {
  return pool
  .connect()
  .then(client => {
    return client
      .query(`SELECT * FROM todos WHERE user_id=${id} and appointment=true`)
      .then(res => {
        client.release();
        return res.rows;
      })
      .catch(err => {
        client.release();
        console.log(err.stack);
      })
  })
}

const addUser = function(firstname, lastname, email, password, cb) {
  return pool
  .connect()
  .then(client => {
    return client
      .query(`INSERT INTO users (firstname, lastname, email, password) VALUES ('${firstname}', '${lastname}', '${email}', crypt('${password}', gen_salt('bf', 8))) RETURNING *;`)
      .then(res => {
        cb(null, res.rows);
      })
      .catch(err => {
        cb(err);
      })
      .then(() => {
        client.release()
      });
  })
}

const getUser = function(email, cb) {
  return pool
  .connect()
  .then(client => {
    return client
      .query(`SELECT * FROM users WHERE email='${email}'`)
      .then(res => {
        cb(null, res.rows);
      })
      .catch(err => {
        cb(err);
      })
      .then(() => {
        client.release()
      });
  })
}

const validatePassword = function(email, password, cb) {
  return pool
  .connect()
  .then(client => {
    return client
      .query(`SELECT user_id FROM users WHERE email='${email}' AND password=crypt('${password}', password);`)
      .then(res => {
        cb(null, res.rows);
      })
      .catch(err => {
        cb(err);
      })
      .then(() => {
        client.release()
      });
  })
}

// makeuseof.com/passport-authenticate-node-postgres

// Check if an email is already registered
const emailExists = async (email) => {
  const data = await pool.query(
    `SELECT * FROM users WHERE email='${email}';`
  );
  if (data.rowCount === 0) return false;
  return data.rows[0];
};

// Create a new user
const createUser = async (firstname, lastname, email, password) => {
  const data = await pool.query(
    `INSERT INTO users (firstname, lastname, email, password)
     VALUES ('${firstname}', '${lastname}', '${email}', crypt('${password}', gen_salt('bf', 8)))
     RETURNING *;`
  );

  if (data.rowCount === 0) return false;
  return data.rows[0];
};

// Compare plain text password give by user to the hashed password in the database
const matchPassword = async (email, password) => {
  const data = await pool.query(
    `SELECT *
     FROM users
     WHERE email='${email}'
     AND password=crypt('${password}', password);`
  );
  return data.rows[0] !== undefined;
};

module.exports = {
  pool,
  getTodos,
  createTodo,
  deleteTodo,
  getCategories,
  createCategory,
  bookAppointment,
  getAppointments,
  getUser,
  addUser,
  validatePassword,
  emailExists,
  createUser,
  matchPassword
};