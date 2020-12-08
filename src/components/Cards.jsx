import React, { Component } from "react";
import { Accordion, Button, Card } from "react-bootstrap";

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

export default class Cards extends Component {
  state = {
    incorrect_answers: this.props.question.incorrect_answers,
    correct_answer: this.props.question.correct_answer,
    answers: [],
  };

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  componentDidMount() {
    const answers = this.state.incorrect_answers;
    answers.push(this.state.correct_answer);
    this.shuffleArray(answers);
    this.setState({ answers: answers });
  }

  componentDidUpdate(prevProps) {
    if (this.props.question !== prevProps.question) {
      this.setState({
        incorrect_answers: this.props.question.incorrect_answers,
        correct_answer: this.props.question.correct_answer,
        answers: [],
      });
      const answers = this.props.question.incorrect_answers;
      answers.push(this.props.question.correct_answer);
      this.shuffleArray(answers);
      this.setState({ answers: answers });
    }
  }

  render() {
    return (
      <div>
        <Card>
          <Card.Header>
            <Accordion.Toggle
              as={Button}
              eventKey={this.props.eventKey}
              style={{ width: "100%" }}
            >
              <h3>
                {this.props.question.question.replace(
                  /&#?\w+;/g,
                  (match) => entities[match]
                )}
              </h3>
              <div>
                {this.state.answers.map((answer, index) => {
                  return (
                    <p key={index}>
                      {index
                        .toString()
                        .replace(/^[0-9]+$/g, (match) => options[match])}
                      : {answer.replace(/&#?\w+;/g, (match) => entities[match])}
                    </p>
                  );
                })}
              </div>
            </Accordion.Toggle>
          </Card.Header>
          <Accordion.Collapse eventKey={this.props.eventKey}>
            <Card.Body>{this.state.correct_answer}</Card.Body>
          </Accordion.Collapse>
        </Card>
      </div>
    );
  }
}
