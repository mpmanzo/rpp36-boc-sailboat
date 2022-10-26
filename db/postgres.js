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

// Authorization Queries
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

const getUserByEmail = function(email, cb) {
  return pool
  .connect()
  .then(client => {
    return client
      .query(`SELECT * FROM users WHERE email='${email}'`)
      .then(res => {
        res.rowCount > 0 ? cb(null, res.rows[0]) : cb(null, false);
      })
      .catch(err => {
        cb(err);
      })
      .then(() => {
        client.release()
      });
  })
}

const getUserById = function(id, cb) {
  return pool
  .connect()
  .then(client => {
    return client
      .query(`SELECT * FROM users WHERE user_id='${id}'`)
      .then(res => {
        cb(null, res.rows[0]);
      })
      .catch(err => {
        cb(err);
      })
      .then(() => {
        client.release()
      });
  })
}

const verifyPassword = function(email, password, cb) {
  return pool
  .connect()
  .then(client => {
    return client
      .query(`SELECT user_id FROM users WHERE email='${email}' AND password=crypt('${password}', password);`)
      .then(res => {
        res.rowCount > 0 ? cb(null, true) : cb(null, false);
      })
      .catch(err => {
        cb(err);
      })
      .then(() => {
        client.release()
      });
  })
}

module.exports = {
  pool,
  getTodos,
  createTodo,
  deleteTodo,
  getCategories,
  createCategory,
  bookAppointment,
  getAppointments,
  addUser,
  getUserByEmail,
  getUserById,
  verifyPassword
};