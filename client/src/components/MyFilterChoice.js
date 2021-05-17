import ListGroup from "react-bootstrap/ListGroup";
import { NavLink } from 'react-router-dom';

function MyFilterChoice(props) {

  return (
    <>
      <ListGroup variant="flush" id="sidebarMenu">
        <ListGroup.Item as={NavLink} to="/all" className="list-group-item" activeClassName="active" action>
          All
        </ListGroup.Item>

        <ListGroup.Item as={NavLink} to="/important" className="list-group-item" activeClassName="active" action>
          Important
        </ListGroup.Item>

        <ListGroup.Item as={NavLink} to="/today" className="list-group-item" activeClassName="active" action>
          Today
        </ListGroup.Item>

        <ListGroup.Item as={NavLink} to="/next7days" className="list-group-item" activeClassName="active" action>
          Next 7 Days
        </ListGroup.Item>

        <ListGroup.Item as={NavLink} to="/private" className="list-group-item" activeClassName="active" action>
          Private
        </ListGroup.Item>
      </ListGroup>
    </>
  );
}

export default MyFilterChoice;
