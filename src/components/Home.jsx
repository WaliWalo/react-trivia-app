import React, { Component } from "react";
import axios from "axios";
import Pusher from "pusher-js";
import { Accordion, Button, Card, Form, ListGroup } from "react-bootstrap";
import { getQuestions } from "../api/triviaApi";
import Cards from "./Cards";
import { withRouter } from "react-router-dom";

const entities = {
  "&#039;": "'",
  "&quot;": '"',
  "&shy;": "",
  // add more if needed
};

const options = {
  0: "A",
  1: "B",
  2: "C",
  3: "D",
};

class Home extends Component {
  state = {
    parameter: {
      noOfQues: "10",
      category: "9",
      difficulty: "easy",
    },
    questions: [],
    text: "",
    username: "",
    users: [],
    currentQuestion: {},
    started: false,
  };

  componentDidMount() {
    const username = window.prompt("Username: ", "Anonymous");
    this.setState({ username });

    const pusher = new Pusher("8e89aecbbecc93a64a18", {
      cluster: "eu",
      encrypted: true,
    });
    const channel = pusher.subscribe("chat");
    channel.bind("questions", (data) => {
      this.setState({
        questions: data.questions,
        currentQuestion: data.currentQuestion,
      });
    });
    // this.handleTextChange = this.handleTextChange.bind(this);
  }

  // handleTextChange(e) {
  //   if (e.keyCode === 13) {
  //     const payload = {
  //       username: this.state.username,
  //       message: this.state.text,
  //     };
  //     axios.post(process.env.REACT_APP_BE_URL, payload);
  //   } else {
  //     this.setState({ text: e.target.value });
  //   }
  // }

  handleSubmit = async (e) => {
    e.preventDefault();
    const questions = await getQuestions(
      this.state.parameter.noOfQues,
      this.state.parameter.category,
      this.state.parameter.difficulty
    );
    this.setState({ questions: questions.results });
    // const payload = {
    //   questions: questions.results,
    // };
    // console.log(process.env.REACT_APP_BE_URL);
    // axios.post(`${process.env.REACT_APP_BE_URL}/questions`, payload);
  };

  inputOnChange = (e) => {
    this.setState({
      parameter: { ...this.state.parameter, [e.target.id]: e.target.value },
    });
  };

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  handleStart = () => {
    if (this.state.questions) {
      let questions = [...this.state.questions];
      let question = { ...questions[0] };
      let answers = [...question.incorrect_answers];
      if (
        this.state.questions[0].incorrect_answers.length + 1 !==
        answers.length
      ) {
        answers.push(question.correct_answer);
      }
      this.shuffleArray(answers);
      question.answers = answers;
      this.setState({ currentQuestion: question });
      const payload = {
        questions: this.state.questions,
        currentQuestion: question,
      };
      //console.log(process.env.REACT_APP_BE_URL);
      axios.post(`${process.env.REACT_APP_BE_URL}/questions`, payload);
    } else {
      alert("NO QUESTIONS SELECTED");
    }
  };

  render() {
    return (
      <div>
        {!this.state.currentQuestion.answers ? (
          <>
            {this.state.username === "admin" ? (
              <Form onSubmit={this.handleSubmit}>
                <Form.Group>
                  <Form.Label>Number of Questions</Form.Label>
                  <Form.Control
                    type="number"
                    defaultValue="10"
                    id="noOfQues"
                    onChange={this.inputOnChange}
                  />
                  <Form.Label>Select Category</Form.Label>
                  <Form.Control
                    as="select"
                    onChange={this.inputOnChange}
                    id="category"
                  >
                    <option value="9">General Knowledge</option>
                    <option value="10">Entertainment: Books</option>
                    <option value="11">Entertainment: Film</option>
                    <option value="12">Entertainment: Music</option>
                    <option value="13">
                      Entertainment: Musicals &amp; Theatres
                    </option>
                    <option value="14">Entertainment: Television</option>
                    <option value="15">Entertainment: Video Games</option>
                    <option value="16">Entertainment: Board Games</option>
                    <option value="17">Science &amp; Nature</option>
                    <option value="18">Science: Computers</option>
                    <option value="19">Science: Mathematics</option>
                    <option value="20">Mythology</option>
                    <option value="21">Sports</option>
                    <option value="22">Geography</option>
                    <option value="23">History</option>
                    <option value="24">Politics</option>
                    <option value="25">Art</option>
                    <option value="26">Celebrities</option>
                    <option value="27">Animals</option>
                    <option value="28">Vehicles</option>
                    <option value="29">Entertainment: Comics</option>
                    <option value="30">Science: Gadgets</option>
                    <option value="31">
                      Entertainment: Japanese Anime &amp; Manga
                    </option>
                    <option value="32">
                      Entertainment: Cartoon &amp; Animations
                    </option>
                  </Form.Control>
                  <Form.Label>Select Difficulty</Form.Label>
                  <Form.Control
                    as="select"
                    onChange={this.inputOnChange}
                    id="difficulty"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </Form.Control>
                </Form.Group>
                <Button type="submit">Get Questions</Button>
                <Button className="ml-3" onClick={this.handleStart}>
                  Start Quiz
                </Button>
              </Form>
            ) : (
              <h1>Wait for admin to start quiz</h1>
            )}
          </>
        ) : (
          <>
            <h2>STARTED</h2>
            <Card>
              <Card.Header as="h5">
                {this.state.currentQuestion.question.replace(
                  /&#?\w+;/g,
                  (match) => entities[match]
                )}
              </Card.Header>
              <Card.Body>
                <Card.Text>
                  <ListGroup>
                    {this.state.currentQuestion.answers.map((answer, index) => (
                      <ListGroup.Item key={index}>
                        {index
                          .toString()
                          .replace(/^[0-9]+$/g, (match) => options[match])}
                        .{" "}
                        {answer.replace(/&#?\w+;/g, (match) => entities[match])}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Text>
                <Button variant="primary">Next</Button>
              </Card.Body>
            </Card>
          </>
        )}

        {/* <Accordion className="mt-3">
          {this.state.questions.map((question, index) => {
            return (
              <Cards question={question} key={index} eventKey={index + 1} />
            );
          })}
        </Accordion> */}
      </div>
    );
  }
}

export default withRouter(Home);
