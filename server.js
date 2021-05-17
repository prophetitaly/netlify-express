const express = require("express");
const morgan = require("morgan");
const { check, query, validationResult } = require("express-validator");

const dao = require("./dao");
const { response } = require("express");

const PORT = 3001;

const app = express();
app.use(morgan("dev"));
app.use(express.json()); // parse the body in JSON format => populate req.body attributes
app.use(express.static("./build"));


/*** APIs ***/

app.get("/", (req, res)=>{res.redirect("/index.html")});

// GET /api/tasks/
app.get('/api/tasks/', async (req, res) => {
  dao.getAllTasks()
    .then((tasks) => res.json(tasks))
    .catch(() => res.status(500).end());
});

// GET /api/tasks/<id>
app.get('/api/tasks/:id', async (req, res) => {
  try {
    const result = await dao.getTask(req.params.id);
    if (result.error)
      res.status(404).json(result);
    else
      res.json(result);
  } catch (err) {
    res.status(500).end();
  }
});

// PUT /api/tasks/<id>
app.put('/api/tasks/:id', [
  check('description').isString(),
  check('id').isInt(),
  check('important').isBoolean(),
  check('private').isBoolean(),
  check('completed').isBoolean(),
  check('user').isInt()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const task = req.body;

  // id passed in the URL matches with the id in req.body
  if (req.params.id !== task.id) {
    res.status(503).json({ error: `URL id different from body id ${req.params.id}.` });
    return;
  }

  try {
    await dao.updateTask(task);
    res.status(200).end();
  } catch (err) {
    res.status(503).json({ error: `Database error during the update of task ${req.params.id}.` });
  }

});

// GET /api/tasks/maxID
app.get('/api/maxID', async function (req, res) {
  /*try {
    const lastID = await dao.getLastId();
    console.log(lastID);
    res.json(lastID);
  } catch (err) {
    res.status(503).json({ error: `Database error during the retrieval of max id.` });
  }
*/
  dao.getLastId()
    .then((row) => res.json(row))
    .catch(() => res.status(500).end());
});

// POST /api/tasks/
app.post('/api/tasks/', [
  check('description').isString(),
  check('important').isBoolean(),
  check('private').isBoolean(),
  check('completed').isBoolean(),
  check('user').isInt()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const task = req.body;

  try {
    const lastId = await dao.getLastId();
    task.id = lastId + 1;
    await dao.addTask(task);
    res.status(200).end();
  } catch (err) {
    res.status(503).json({ error: `${err}.` });
  }

});


app.get(
  "/api/tasks",
  [
    query("from").isDate({ format: "YYYY-MM-DD", strictMode: true }).optional(),
    query("to").isDate({ format: "YYYY-MM-DD", strictMode: true }).optional(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) res.status(502).json({ errors: errors.array() });

    const filterObj = dao.filter();
    if (req.query.important === "1") filterObj.important();
    if (req.query.private === "1") filterObj.private();
    if (req.query.from) filterObj.from(req.query.from);
    if (req.query.to) filterObj.to(req.query.to);

    filterObj.run()
      .then(tasks => {
        res.json(tasks);
      })
      .catch(err => {
        res.status(501).json(err);
      })
  }
);


/* Mark a task as completed/uncompleted */

app.put('/api/tasks/completed', async (req, res) => { /*should there be validation for the mark value?*/
  /*dao.markTask({id : req.body.id,completed : req.body.completed})
      .then(() => { res.end(); })
      .catch((error) => { res.status(501).json(error); });*/
  const id = req.body.id;
  const completed = req.body.completed;
  try {
    await dao.markTask({ id: req.body.id, completed: req.body.completed });
    res.end();
  } catch (error) {
    res.status(501).json(error);
  }

});

/* Delete a task */


app.delete('/api/tasks/delete/:id', (req, res) => {
  dao.deleteTask(req.params.id)
    .then(() => { res.end(); })
    .catch((error) => { res.status(501).json(error); });
});


app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}/`)
);
