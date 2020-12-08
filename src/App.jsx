import "./App.css";
import Home from "./components/Home";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
function App() {
  return (
    <div className="App">
      <Container>
        <Home />
      </Container>
    </div>
  );
}

export default App;
