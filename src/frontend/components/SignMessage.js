import React, { Component } from "react";
import { ethers } from "ethers";
import { Card, Button, Form } from "react-bootstrap";

export default class SignMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      signedMessage: "",
      error: null,
    };
    this.handleChange = this.handleChange.bind(this);
    this.signMessage = this.signMessage.bind(this);
  }

  handleChange(event) {
    const inputValue = event.target.value;
    const stateField = event.target.name;
    this.setState({
      [stateField]: inputValue,
    });
  }

  async signMessage() {
    const { message } = this.state;
    try {
      // Get provider from Metamask
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // The message will be signed by the current user
      const signedMessage = await signer.signMessage(message);

      this.setState({ signedMessage });
    } catch (err) {
      this.setState({ error: err.message });
    }
  }

  render() {
    const { error, signedMessage } = this.state;

    return (
      <div className="container mt-5">
        <Card style={{ width: "50%", margin: "0 auto" }}>
          <Card.Body>
            <Card.Title>Sign a Message</Card.Title>
            <Form>
              <Form.Group>
                <Form.Label>Message:</Form.Label>
                <Form.Control
                  type="text"
                  name="message"
                  onChange={this.handleChange}
                  value={this.state.message}
                  placeholder="Enter a message to sign"
                />
              </Form.Group>
              <Button
                variant="primary"
                onClick={this.signMessage}
                className="margin-top"
              >
                Sign Message
              </Button>
            </Form>
            {signedMessage && (
              <div className="mt-3">
                <Card.Title>Signed Message:</Card.Title>
                <Card.Text>{signedMessage}</Card.Text>
              </div>
            )}
            {error && (
              <div className="mt-3">
                <Card.Title>Error:</Card.Title>
                <Card.Text>{error}</Card.Text>
              </div>
            )}
          </Card.Body>
        </Card>
      </div>
    );
  }
}
