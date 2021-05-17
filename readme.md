# BigLab 2 - Class: 2021 WA1

## Team name: TEAM_NAME

Team members:
* s290168 CAMPION FABIANO
* s123456 LASTNAME FIRSTNAME 
* s123456 LASTNAME FIRSTNAME
* s123456 LASTNAME FIRSTNAME (delete line if not needed)

## Instructions

A general description of the BigLab 2 is avaible in the `course-materials` repository, [under _labs_](https://github.com/polito-WA1-AW1-2021/course-materials/tree/main/labs/BigLab2/BigLab2.pdf). In the same repository, you can find the [instructions for GitHub Classroom](https://github.com/polito-WA1-AW1-2021/course-materials/tree/main/labs/GH-Classroom-BigLab-Instructions.pdf), covering this and the next BigLab.

Once cloned this repository, instead, write your names in the above section.

When committing on this repository, please, do **NOT** commit the `node_modules` directory, so that it is not pushed to GitHub.
This should be already automatically excluded from the `.gitignore` file, but double-check.

When another member of the team pulls the updated project from the repository, remember to run `npm install` in the project directory to recreate all the Node.js dependencies locally, in the `node_modules` folder.

Finally, remember to add the `final` tag for the final submission, otherwise it will not be graded.

## List of APIs offered by the server

Provide a short description for API with the required parameters, follow the proposed structure.

### Get all tasks

* **GET**: /api/tasks?\<important=1\>&\<private=1\>&\<from=YYYY-MM-DD\>&\<to=YYYY-MM-DD\>

* *Description*: Retrieve the list of tasks with the specified filters (can be concatenated as in above URL)

* *Request*: EMPTY

* *Response*: [{ id, description, deadline, important, private, completed }, { id, description, deadline, important, private, completed }, ...]

* *Response body*: 
```
[{ id, description, deadline, important, private, completed }, { id, description, deadline, important, private, completed }, ...]
```

* *Errors*:
    * 501 - Internal DB error
    * 502 - Date is not in a valid format

## Mark task as completed/uncompleted

* **PUT**: tasks/update/:id/completed/:mark

* *Description*: Mark a task as completed or not

* *Request*: Id of the task to be marked and the value of the completed parameter

* *Response*: EMPTY

* *Response body*: EMPTY

* *Errors*:
    * 501 - Internal DB error

## Delete a task

* **DELETE**: /api/tasks/:id

* *Description*: Delete a task 

* *Request*: EMPTY

* *Response*: EMPTY

* *Response body*: EMPTY

* *Errors*:
    * 501 - Internal DB error


### __Get a Task (By Id)__

URL: `/api/tasks/<id>`

Method: GET

Description: Get the task identified by the id `<id>`.

Request body: _None_

Response: `200 OK` (success), `404 Not Found` (wrong code), or `500 Internal Server Error` (generic error).

Response body: An object, describing a single task.
```
{
  "id": 2,
  "description": "Go for a walk",
  "important": 1,
  "private": 0,
  "deadline": "2021-04-14 21:00",
  "completed": 1,
  "user": 2
}
```

### __Update a Task__

URL: `/api/exams/<code>`

Method: PUT

Description: Update entirely an existing (passed) task, identified by its id.

Request body: An object representing the entire task (Content-Type: `application/json`).
```
{
  "id": 2,
  "description": "Go for a walk",
  "important": 1,
  "private": 1,
  "deadline": "2021-04-14 21:00",
  "completed": 1,
  "user": 1
}
```

Response: `200 OK` (success) or `503 Service Unavailable` (generic error). If the request body is not valid, `422 Unprocessable Entity` (validation error).

Response body: _None_