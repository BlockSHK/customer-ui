import React, { Component } from "react";
import axios from "axios";

export default class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: "",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const inputValue = event.target.value;
    const stateField = event.target.name;
    this.setState({
      [stateField]: inputValue,
    });
    console.log(this.state);
  }
  async handleSubmit(event) {
    event.preventDefault();
    const { address } = this.state;
    await axios.post(
      "https://b1r5aq31x2.execute-api.us-east-1.amazonaws.com/Prod/activation/nonce",
      { address }
    );
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>Address:</label>
          <input
            type="text"
            name="address"
            onChange={this.handleChange}
            value={this.state.address}
          />
          <button type="submit">Send</button>
        </form>
      </div>
    );
  }
}
