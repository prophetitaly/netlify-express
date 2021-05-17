import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import MyNavbar from "./components/MyNavbar";
import React from 'react';
import MyContainer from "./components/MyContainer";
import {BrowserRouter as Router, Redirect, Route} from 'react-router-dom';



function App() {
  return (
    <Router>
      <Route path={"/"} exact><Redirect to="/all"/></Route>
      <MyNavbar />
      <MyContainer />
    </Router>
  );
}

export default App;
