import NavBar from "react-bootstrap/Navbar";
import { Check2All, PersonCircle } from "react-bootstrap-icons";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import { useState } from 'react';
import MyFilterChoice from "./MyFilterChoice";
import { Col, Row } from "react-bootstrap";
import { NavLink } from 'react-router-dom';

function MyNavbar(props) {

  const [sidebarShow, setSidebarShow] = useState(true);

  return (
    <>
      <NavBar variant="dark" expand="sm" bg="success">
        <Row className="w-100 justify-content-between align-items-center">
          <Col xs="auto">
            <NavBar.Toggle
              collapsed="true"
              aria-controls="collapse-id"
              aria-expanded="false"
              aria-label="Toggle Navigation"
              onClick={() => setSidebarShow(!sidebarShow)}
            />

          </Col>
          <Col xs="auto">
            <NavBar.Brand as={NavLink} to="/all" exact>
              <Check2All />
          ToDo Manager
        </NavBar.Brand>
          </Col>
          <Form className="my-2 my-lg-0 mx-auto d-none d-sm-block">
            <FormControl placeholder="Search" aria-label="Search" type="search" />
          </Form>
          <Col xs="auto"  style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <PersonCircle color="white" size={30} />
          </Col>
        </Row>
        <Row className="d-sm-none d-flex w-100 justify-content-between">
            <NavBar.Collapse>
              <MyFilterChoice show={sidebarShow}>
              </MyFilterChoice>
            </NavBar.Collapse>
        </Row>
      </NavBar>
    </>
  );
}

export default MyNavbar;
