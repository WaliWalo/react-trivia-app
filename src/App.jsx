import React, { Component } from "react";
import "./App.css";
import Home from "./components/Home";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Start from "./components/Start";
class App extends Component {
  render() {
    return (
      <div className="App">
        <Container>
          <Router>
            <Route path="/" exact render={(props) => <Home />} />
            <Route path="/start" exact render={(props) => <Start />} />
          </Router>
        </Container>
      </div>
    );
  }
}

export default App;
