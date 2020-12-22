import React, { Component } from "react";
import "./App.css";
import Home from "./components/Home";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Route } from "react-router-dom";
class App extends Component {
  render() {
    return (
      <div className="App">
        <Container>
          <Router>
            <Route path="/" exact render={(props) => <Home />} />
          </Router>
        </Container>
      </div>
    );
  }
}

export default App;
