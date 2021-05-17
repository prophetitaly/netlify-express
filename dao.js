" use strict ";

const sqlite = require("sqlite3");
// open the database
/*const db = new sqlite.Database('tasks.db', (err) => {
  if (err) throw err;
});*/
// @ TODO decidere se aprire la connessione all'inizio
// @ TODO add close db

function Filter() {
  let sql_query = "SELECT * FROM tasks";
  let private = false,
    important = false,
    from = false,
    to = false;
  let conditions = [],
    params = [];

  // TODO: Add sanitization checks

  return {
    private: function () {
      if (private === true) return this;
      private = true;
      conditions.push("private = 1");
      return this;
    },
    important: function () {
      if (important === true) return this;
      important = true;
      conditions.push("important = 1");
      return this;
    },
    from: function (date) {
      if (from === true) return this;
      from = true;
      conditions.push("datetime(date) > datetime(?)");
      params.push(date);
      return this;
    },
    to: function (date) {
      if (to === true) return this;
      to = true;
      conditions.push("datetime(date) < datetime(?)");
      params.push(date);
      return this;
    },
    run: function () {
      return new Promise((resolve, reject) => {
        const db = new sqlite.Database("tasks.db", function (err) {
          if (err) reject("Could not connect to DB");
        });

        if (conditions.length !== 0) {
          let i;
          sql_query += " WHERE ";
          for (i = 0; i < conditions.length - 1; i++) {
            sql_query += conditions[i] + " AND ";
          }
          sql_query += conditions[i];
        }
        sql_query += ";";

        db.all(sql_query, params, function (err, rows) {
          db.close();
          if (err) reject(err);
          resolve(rows);
        });
      });
    },
  };
}

exports.filter = () => {
  return new Filter();
};

// get all tasks
exports.getAllTasks = () => {
  return new Promise((resolve, reject) => {
    const db = new sqlite.Database('tasks.db', (err) => {
      if (err) throw err;
    });
    const sql = 'SELECT * FROM tasks';
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      if (rows !== undefined) {
        const tasks = rows.map((e) => ({ id: e.id, description: e.description, important: e.important, private: e.private, date: e.date, completed: e.completed, user: e.user }));
        resolve(tasks);
      }
      else {
        resolve(null)
      }

    });
  });
};

// mark as completed/uncompleted an existing task
exports.markTask = (task) => {
  return new Promise((resolve, reject) => {
    const db = new sqlite.Database('tasks.db', function (err) {
      if (err) throw err;
    });
    const sql = 'UPDATE tasks SET completed=? WHERE id = ?';
    db.run(sql, [task.completed, task.id], function (err) {
      db.close();
      if (err) {
        reject(err);
        return;
      }
      /*resolve(this.lastID);  @TODO check this resolve parameter */
      resolve();
    });
  });
};

// delete an existing task
exports.deleteTask = (task_id) => {
  return new Promise((resolve, reject) => {
    const db = new sqlite.Database('tasks.db', function (err) {
      if (err) throw err;
    });
    const sql = 'DELETE FROM tasks WHERE id = ?';
    db.run(sql, [task_id], function (err) {
      if (err || this.changes === 0) {
        reject(err);
        return;
      } else
        resolve(null);
    });
  });
}

// get task by id
exports.getTask = (id) => {
  return new Promise((resolve, reject) => {
    const db = new sqlite.Database('tasks.db', function (err) {
      if (err) throw err;
    });
    const sql = 'SELECT * FROM tasks WHERE id=?';
    db.get(sql, [id], function (err, rows) {
      if (err) {
        reject(err);
        return;
      }
      if (rows !== undefined) {
        const tasks = { id: rows.id, description: rows.description, important: rows.important, private: rows.private, date: rows.date, completed: rows.completed, user: rows.user };
        resolve(tasks);
      }
      else {
        resolve(null)
      }
    });
  });
};

// update an existing task
exports.updateTask = (task) => {
  return new Promise((resolve, reject) => {
    const db = new sqlite.Database('tasks.db', function (err) {
      if (err) throw err;
    });
    const sql = 'UPDATE tasks SET description=?, important=?, private=?, date=?, completed=?, user=? WHERE id = ?';
    db.run(sql, [task.description, task.important, task.private, task.date, task.completed, task.user, task.id], function (err) {
      if (err || this.changes === 0) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
};

// insert a new task
exports.addTask = (task) => {
  return new Promise((resolve, reject) => {
    const db = new sqlite.Database('tasks.db', function (err) {
      if (err) throw err;
    });
    const sql = 'INSERT INTO tasks(id, description, important, private, date, completed, user) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.run(sql, [task.id, task.description, task.important, task.private, task.date, task.completed, task.user], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
};

// get id of last task
exports.getLastId = () => {
  return new Promise((resolve, reject) => {
    const db = new sqlite.Database('tasks.db', function (err) {
      if (err) {
        throw err;
      }
    });
    const sql = 'SELECT MAX(id) AS maxId FROM tasks';
    db.all(sql, [], function (err, rows) {
      if (err) {
        reject(err);
        return;
      }
      if (rows !== undefined) {
        resolve(rows[0].maxId);
      }
      else resolve(0);
    });
  });
};
