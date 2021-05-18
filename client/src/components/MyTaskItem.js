import { PersonSquare, PencilFill, TrashFill, CheckSquare, Backspace } from 'react-bootstrap-icons';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import dayjs from 'dayjs';
import { useState } from 'react';
import { Col } from 'react-bootstrap';
import { Link, Switch, Route, useLocation, useHistory } from 'react-router-dom';


function MyTaskItem(props) {
    const [description, setDescription] = useState(props.task.description);
    const [date, setDate] = useState(props.task.date);
    const [important, setImportant] = useState(props.task.important);
    const [isPrivate, setIsPrivate] = useState(props.task.private);
    const [errorMessageDescription, setErrorMessageDescription] = useState("");
    const [errorMessageDate, setErrorMessageDate] = useState("");

    const location = useLocation();
    const history = useHistory();

    const handleSubmit = async (event) => {
        event.preventDefault();
        let valid = true;

        setErrorMessageDate(() => "");
        if ((date.isBefore(dayjs(), "day") && date !== props.task.date) || !date.isValid()) {
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
            if (props.tasks.some((t) => t.description === description && t.date.format("DD/MM/YYYY") === date.format("DD/MM/YYYY") && t.id !== props.task.id)) {
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
                id: props.task.id, description: description, date: date, important: important, private: isPrivate, completed: 1, user: 2
            };

            /*props.setTasks((oldTasks) => {
                return oldTasks.map(ot => {
                    if (ot.id === task.id)
                        return task;
                    else
                        return ot;
                });
            });*/


            try {
                await fetch("/api/tasks/" + task.id,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(task),
                    });

                await props.setReqUpdate(t => t + 1);
            } catch (error) {
                console.log("Failed to store data on server: ", error);
            };

            setErrorMessageDescription(() => "");
            setErrorMessageDate(() => "");
            history.push(location.pathname.substr(0, location.pathname.lastIndexOf("/")));
        }
    };


    return (
        <Switch>
            <Route path={location.pathname.substring(0, location.pathname.lastIndexOf('/')) + "/" + props.task.id} render={() => {
                return (
                    <ListGroup.Item as="ul" >
                        <Form >
                            <Form.Row className=" align-items-center" >
                                <Form.Group as={Col} className="my-auto" sm={4}>
                                    <Form.Control required isInvalid={errorMessageDescription} value={description} onChange={ev => setDescription(() => ev.target.value)} />
                                    <Form.Control.Feedback type="invalid">{errorMessageDescription}</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} className="my-auto" sm={2}>
                                    <Form.Check type="checkbox" custom id="important" label="Important" defaultChecked={important} onChange={ev => setImportant(() => !important)} />
                                </Form.Group>
                                <Form.Group as={Col} className="my-auto" sm={2}>
                                    <Form.Check type="checkbox" custom id="private" label="Private" defaultChecked={isPrivate} onChange={ev => setIsPrivate(() => !isPrivate)} />
                                </Form.Group>
                                <Form.Group as={Col} className="my-auto" sm={3}>
                                    <Form.Control type='date' isInvalid={errorMessageDate} min={dayjs().format('YYYY-MM-DD')} value={date.format('YYYY-MM-DD')} onChange={ev => setDate(() => dayjs(ev.target.value))} />
                                    <Form.Control.Feedback type="invalid">{errorMessageDate}</Form.Control.Feedback>
                                </Form.Group>
                                <Col style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button variant="danger" style={{
                                        background: "red",
                                        color: "white",
                                        padding: "3px ",
                                        height: "24px"
                                    }} onClick={(event) => { event.preventDefault(); history.push(location.pathname.substr(0, location.pathname.lastIndexOf("/"))); }}>
                                        <div className="d-flex w-100 justify-content-between align-items-center" style={{
                                            height: "16px", width: "16px"
                                        }}>
                                            <Backspace style={{
                                                height: "16px", width: "16px", padding: "0px"
                                            }} />
                                        </div>
                                    </Button>
                                    <span className="mx-1"></span>
                                    <Button variant="success" style={{
                                        background: "green",
                                        color: "white",
                                        padding: "3px",
                                        height: "24px"
                                    }} onClick={handleSubmit}>
                                        <div className="d-flex w-100 justify-content-between align-items-center" style={{
                                            height: "16px", width: "16px"
                                        }}>
                                            <CheckSquare style={{
                                                height: "16px", width: "16px", padding: "0px"
                                            }} />
                                        </div>
                                    </Button>
                                </Col>
                            </Form.Row>
                        </Form>
                    </ListGroup.Item >
                )
            }} />

            <Route render={() => {
                return (
                    <ListGroup.Item as="ul">
                        <div className="d-flex w-100 justify-content-between align-items-center" >
                            <Col sm={6}>
                                <Form.Check
                                    type="checkbox"
                                    label={props.task.description}
                                    id={props.task.id}
                                    className={props.task.important ? "important" : ""}
                                    custom
                                />
                            </Col>
                            <Col>
                                {props.task.private ? <PersonSquare /> : <></>}
                            </Col>
                            <div>
                                <small>{props.task.date.format("DD MMM YYYY")}       </small>
                                <Button as={Link} to={!isNaN(location.pathname.substr(location.pathname.lastIndexOf("/") + 1)) ? location.pathname.substr(0, location.pathname.lastIndexOf("/")) + "/" + props.task.id : location.pathname + "/" + props.task.id} id="modifyButton" style={{
                                    padding: "3px",
                                    height: "24px"
                                }}>
                                    <div className="d-flex w-100 justify-content-between align-items-center" style={{
                                        height: "16px", width: "16px"
                                    }}>
                                        <PencilFill style={{
                                            height: "16px", width: "16px", padding: "0px"
                                        }} />
                                    </div>
                                </Button>
                                <Button id="deleteButton" style={{
                                    padding: "3px",
                                    height: "24px"
                                }} onClick={(event) => { event.preventDefault(); props.deleteTask(props.task.id) }}>
                                    <div className="d-flex w-100 justify-content-between align-items-center" style={{
                                        height: "16px", width: "16px"
                                    }}>
                                        <TrashFill style={{
                                            height: "16px", width: "16px", padding: "0px"
                                        }} />
                                    </div>
                                </Button>
                            </div>
                        </div>
                    </ListGroup.Item>
                )
            }} />


        </Switch>
    );
}



export default MyTaskItem;