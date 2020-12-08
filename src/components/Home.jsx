import React, { Component } from "react";
import { Accordion, Button, Form } from "react-bootstrap";
import { getQuestions } from "../api/triviaApi";
import Cards from "./Cards";

export default class Home extends Component {
  state = {
    parameter: {
      noOfQues: "10",
      category: "9",
      difficulty: "easy",
    },
    questions: [],
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const questions = await getQuestions(
      this.state.parameter.noOfQues,
      this.state.parameter.category,
      this.state.parameter.difficulty
    );
    this.setState({ questions: questions.results });
  };

  inputOnChange = (e) => {
    this.setState({
      parameter: { ...this.state.parameter, [e.target.id]: e.target.value },
    });
  };

  render() {
    return (
      <div>
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
              <option value="13">Entertainment: Musicals &amp; Theatres</option>
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
        </Form>
        <Accordion className="mt-3">
          {this.state.questions.map((question, index) => {
            return (
              <Cards question={question} key={index} eventKey={index + 1} />
            );
          })}
        </Accordion>
      </div>
    );
  }
}
