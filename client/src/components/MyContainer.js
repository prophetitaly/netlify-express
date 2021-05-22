import MyFilterChoice from "./MyFilterChoice";
import MyTaskList from "./MyTaskList"
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from 'react-bootstrap/Button'
import { Plus } from 'react-bootstrap-icons';
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import React from 'react';
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form"
import { CheckSquare } from 'react-bootstrap-icons';
import { Switch, Route } from 'react-router-dom';
import API from "./API";


function MyContainer(props) {

  const [tasks, setTasks] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [waiting, setWaiting] = useState(true);
  const [reqUpdate, setReqUpdate] = useState(true);

  useEffect(() => {
    if (reqUpdate) {
      API.loadTasks().then((t) => {
        if (t.err === undefined) {
          setTasks(t);
          console.log(t);
          setWaiting(false);
          setReqUpdate(false);
        }
      });
    }
  }, [reqUpdate]);

  return (
    <Container fluid>
      <Row className="min-height-94">
        <Col className="bg-light pt-3 d-none d-sm-block" sm={4}>
          <MyFilterChoice></MyFilterChoice>
        </Col>
        {!waiting && <Col className="pt-3" sm={8}>

          <Switch>
            <Route path="/important" render={() => {
              return (
                <MyTaskList setReqUpdate={setReqUpdate} tasks={tasks} setTasks={setTasks} filter={(t) => t.important} />
              );
            }} />

            <Route path="/today" render={() => {
              return (
                <MyTaskList setReqUpdate={setReqUpdate} tasks={tasks} setTasks={setTasks} filter={(t) => (t.date.isSame(dayjs(), 'day'))} />
              );
            }} />

            <Route path="/next7days" render={() => {
              return (
                <MyTaskList setReqUpdate={setReqUpdate} tasks={tasks} setTasks={setTasks} filter={(t) =>
                  (t.date.isAfter(dayjs(), 'day') && t.date.isBefore(dayjs().add(7, 'day'), 'day'))} />
              );
            }} />

            <Route path="/private" render={() => {
              return (
                <MyTaskList setReqUpdate={setReqUpdate} tasks={tasks} setTasks={setTasks} filter={(t) => t.private} />
              );
            }} />

            <Route path="/all" render={() => {
              return (
                <MyTaskList setReqUpdate={setReqUpdate} tasks={tasks} setTasks={setTasks} filter={(t) => true} />
              );
            }} />

          </Switch>
        </Col>}
      </Row>
      <Button variant="success" id="AddTask" onClick={() => setModalShow(true)}>
        <Plus width="40" height="50" />
      </Button>
      {!waiting && <MyModalForm
        setReqUpdate={setReqUpdate}
        tasks={tasks}
        setTasks={setTasks}
        show={modalShow}
        onHide={() => setModalShow(false)}
      />}
    </Container>
  )
}

function MyModalForm(props) {
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(dayjs());
  const [important, setImportant] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [errorMessageDescription, setErrorMessageDescription] = useState("");
  const [errorMessageDate, setErrorMessageDate] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    let valid = true;

    setErrorMessageDate(() => "");
    if (date.isBefore(dayjs().format("YYYY-MM-DD")) || !date.isValid()) {
      valid = false;
      setErrorMessageDate((e) => {
        if (e === "") {
          return ("Invalid date (should be after " + dayjs().format("DD/MM/YYYY") + ")")
        }
      })
    }
    if (description === "") {
      valid = false;
      setErrorMessageDescription((e) => {
        return "Invalid description (should have a description)"
      })
    } else {
      if (props.tasks.some((t) => t.description === description && t.date.format("DD/MM/YYYY") === date.format("DD/MM/YYYY"))) {
        valid = false;
        setErrorMessageDescription((e) => {
          return ("Invalid description (should not have the same description and date as other tasks)")
        }
        )
        setErrorMessageDate((e) => {
          return ("Invalid date (should not have the same description and date as other tasks)")
        }
        )
      }
    }


    if (valid) {
      const task = {
        description: description, date: date.format('YYYY-MM-DD'), important: important, private: isPrivate, completed: 0, user: 0
      };

      //props.setTasks((oldTasks) => [...oldTasks, task]);

      try {
        await fetch("/api/tasks/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(task),
          });

        await props.setReqUpdate(t => t + 1);
      } catch (error) {
        console.log("Failed to store data on server: ", error);
      };

      resetForm();
      props.onHide();
    }

  };

  function resetForm() {
    setErrorMessageDescription(() => "");
    setErrorMessageDate(() => "");
    setDate(() => dayjs());
    setDescription(() => '');
    setIsPrivate(() => false);
    setImportant(() => false);
  }

  return (
    <Modal
      show={props.show}
      onHide={() => { resetForm(); props.onHide() }}
      size="lg"
      aria-labelledby="modalForm"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="modalForm">
          <h2>New Task</h2>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form >
          <Form.Row className=" align-items-center" >
            <Form.Group as={Col} className="my-auto" >
              <Form.Label>Description</Form.Label>
              <Form.Control required placeholder="Description" isInvalid={errorMessageDescription} value={description} onChange={ev => setDescription(() => ev.target.value)} />
              <Form.Control.Feedback type="invalid">{errorMessageDescription}</Form.Control.Feedback>
            </Form.Group>
          </Form.Row>
          <Form.Row className="mt-2">
            <Form.Group as={Col} className="my-auto" sm="auto">
              <Form.Label>Date</Form.Label>
              <Form.Control type='date' isInvalid={errorMessageDate} min={dayjs().format('YYYY-MM-DD')} value={date.format('YYYY-MM-DD')} onChange={ev => setDate(() => dayjs(ev.target.value))} />
              <Form.Control.Feedback type="invalid">{errorMessageDate}</Form.Control.Feedback>
            </Form.Group>
            <Col></Col>
            <Form.Group as={Col} className="my-auto" >
              <Form.Check type="checkbox" custom id="important" label="Important" onChange={ev => setImportant(() => !important)} />
            </Form.Group>
            <Form.Group as={Col} className="my-auto" >
              <Form.Check type="checkbox" custom id="private" label="Private" onChange={ev => setIsPrivate(() => !isPrivate)} />
            </Form.Group>
            <Col sm="auto" className="d-flex align-items-center" >
              <Button variant="success" style={{
                background: "green",
                color: "white",
                padding: "6px",
                height: "48px"
              }} onClick={handleSubmit}>
                <div className="d-flex w-100 justify-content-between align-items-center" style={{
                  height: "32px", width: "32px"
                }}>
                  <CheckSquare style={{
                    height: "32px", width: "32", padding: "0px"
                  }} />
                </div>
              </Button>
            </Col>
          </Form.Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="danger"
          onClick={() => {
            resetForm();
            props.onHide();
          }
          }>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default MyContainer;