import ListGroup from 'react-bootstrap/ListGroup';
import React from 'react';
import MyTaskItem from './MyTaskItem';
import { useLocation } from 'react-router';


function MyTaskList(props) {
  const location = useLocation();

  const deleteTask = (tId) => {
    //props.setTasks((oldTasks) => oldTasks.filter(t => t.id !== tId));
    fetch("/api/tasks/delete/"+tId,
        {
          method: "DELETE"
        })
        .catch(function(error){
          console.log("Failed to cancel task from server: ", error);
        });
  }

  const filterAndMap = (t) => {
    if (props.filter(t)) {
      return (
        <MyTaskItem key={t.id}
          task={t}
          deleteTask={deleteTask}
          tasks={props.tasks}
          setTasks={props.setTasks}
        />
      )
    }
    else {
      return "";
    }
  }

  return (
    <>
      <h2><b>Filter: </b>{location.pathname.substr(location.pathname.indexOf("/")+1).split("/")[0]}</h2>
      <ListGroup as="ul" variant="flush">{
        props.tasks.map(filterAndMap)
      }
      </ListGroup>
    </>);
}

export default MyTaskList;