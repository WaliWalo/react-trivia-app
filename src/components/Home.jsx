import React, { Component } from "react";
import axios from "axios";
import Pusher from "pusher-js";
import { Button, Card, Form, ListGroup, Spinner } from "react-bootstrap";
import { getQuestions } from "../api/triviaApi";
import { withRouter } from "react-router-dom";

const entities = {
  "&#039;": "'",
  "&quot;": '"',
  "&shy;": "",
  undefined: "",
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
    username: "",
    users: [],
    currentQuestion: {},
    answered: "block",
    scores: "none",
    counter: 0,
    loading: true,
  };

  componentDidMount() {
    const username = window.prompt("Username: ", "Anonymous");
    this.setState({ username });
    const pusher = new Pusher(process.env.REACT_APP_PUSHER_API_KEY, {
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
    channel.bind("answer", (data) => {
      this.setState({
        users: data.users,
      });
    });
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ loading: true });
    const questions = await getQuestions(
      this.state.parameter.noOfQues,
      this.state.parameter.category,
      this.state.parameter.difficulty
    );
    this.setState({ questions: questions.results, loading: false });
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
      let question = { ...questions[this.state.counter] };
      let answers = [...question.incorrect_answers];
      if (
        this.state.questions[this.state.counter].incorrect_answers.length +
          1 !==
        answers.length
      ) {
        answers.push(question.correct_answer);
      }
      this.shuffleArray(answers);
      question.answers = answers;
      let counter = this.state.counter;
      this.setState({ currentQuestion: question, counter: counter });
      const payload = {
        questions: this.state.questions,
        currentQuestion: question,
      };
      axios.post(`${process.env.REACT_APP_BE_URL}/questions`, payload);
    } else {
      alert("NO QUESTIONS SELECTED");
    }
  };

  handleNext = () => {
    if (this.state.counter + 1 === this.state.questions.length) {
      let counter = this.state.counter + 1;
      this.setState({ counter: counter });
    } else {
      let questions = [...this.state.questions];
      let question = { ...questions[this.state.counter + 1] };
      let answers = [...question.incorrect_answers];
      if (
        this.state.questions[this.state.counter + 1].incorrect_answers.length +
          1 !==
        answers.length
      ) {
        answers.push(question.correct_answer);
      }
      this.shuffleArray(answers);
      question.answers = answers;
      let counter = this.state.counter + 1;
      this.setState({ currentQuestion: question, counter: counter });
      const payload = {
        questions: this.state.questions,
        currentQuestion: question,
      };

      axios.post(`${process.env.REACT_APP_BE_URL}/questions`, payload);
    }
  };

  handleSubmitAnswer = (e) => {
    this.setState({ answered: "none", scores: "block" });
    let user = {};
    let currentUser = this.state.users.find(
      (user) => user.user === this.state.username
    );
    if (currentUser !== undefined) {
      user = currentUser;
      user.answer = e.target.id;
      //CALCULATE SCORE
      if (user.answer === this.state.currentQuestion.correct_answer) {
        user.score += 100;
      }

      let newUsers = this.state.users.filter(
        (user) => user.user !== this.state.username
      );
      newUsers.push(user);
      this.setState({ users: newUsers });
    } else {
      let answer = e.target.id;
      //CALCULATE SCORE
      let score = 0;
      if (answer === this.state.currentQuestion.correct_answer) {
        score = 100;
      }
      user = { user: this.state.username, answer: e.target.id, score: score };
      this.state.users.push(user);
    }

    let newUsers = this.state.users;
    this.setState({ users: newUsers });
    const payload = {
      users: newUsers,
    };
    axios.post(`${process.env.REACT_APP_BE_URL}/user`, payload);
  };

  componentDidUpdate = (prevProp, prevState) => {
    if (this.state.currentQuestion !== prevState.currentQuestion) {
      this.state.users.sort((a, b) => (a.score > b.score ? 1 : -1));
      if (this.state.answered === "none") {
        this.setState({ answered: "block" });
      }
      if (this.state.scores === "block") {
        this.setState({ scores: "none" });
      }
    }
  };

  render() {
    return (
      <>
        {this.state.counter + 1 > this.state.questions.length &&
        this.state.questions.length !== 0 ? (
          <>
            <h2>{this.state.questions.length} Quiz Completed</h2>
            <ListGroup>
              {this.state.users.reverse().map((user) => (
                <ListGroup.Item>
                  {user.user}: {user.score}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </>
        ) : (
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
                    {this.state.loading ? (
                      <Spinner animation="border" role="status">
                        <span className="sr-only">Loading...</span>
                      </Spinner>
                    ) : (
                      <Button className="ml-3" onClick={this.handleStart}>
                        Start Quiz
                      </Button>
                    )}
                  </Form>
                ) : (
                  <h1>Wait for admin to start quiz</h1>
                )}
              </>
            ) : (
              <>
                <h2>TRIVIA</h2>
                <Card>
                  <Card.Header as="h5">
                    {this.state.currentQuestion.question.replace(
                      /&#?\w+;/g,
                      (match) => entities[match]
                    )}
                  </Card.Header>
                  <Card.Body>
                    <Card.Text>
                      <ListGroup style={{ display: this.state.answered }}>
                        {this.state.currentQuestion.answers.map(
                          (answer, index) => (
                            <ListGroup.Item
                              key={index}
                              id={answer}
                              onClick={this.handleSubmitAnswer}
                            >
                              {index
                                .toString()
                                .replace(
                                  /^[0-9]+$/g,
                                  (match) => options[match]
                                )}
                              .{" "}
                              {answer.replace(
                                /&#?\w+;/g,
                                (match) => entities[match]
                              )}
                            </ListGroup.Item>
                          )
                        )}
                      </ListGroup>
                    </Card.Text>
                    {this.state.username === "admin" && (
                      <>
                        <Button variant="primary" onClick={this.handleNext}>
                          Next
                        </Button>
                      </>
                    )}
                  </Card.Body>
                </Card>
                <ListGroup style={{ display: this.state.scores }}>
                  <ListGroup.Item>
                    Correct Answer:{" "}
                    {this.state.currentQuestion.correct_answer.replace(
                      /&#?\w+;/g,
                      (match) => entities[match]
                    )}
                  </ListGroup.Item>
                  {this.state.users.reverse().map((user) => (
                    <ListGroup.Item>
                      {user.user} answered{" "}
                      {user.answer.replace(
                        /&#?\w+;/g,
                        (match) => entities[match]
                      )}
                      : {user.score}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </>
            )}
          </div>
        )}
      </>
    );
  }
}

export default withRouter(Home);
