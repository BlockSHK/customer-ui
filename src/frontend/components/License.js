import React, { Component } from "react";
import axios from "axios";

export default class License extends Component {
  constructor(props) {
    super(props);
    this.state = {
      licenses: [],
      error: null,
    };
  }

  componentDidMount() {
    this.fetchLicenses();
  }

  fetchLicenses = async () => {
    try {
      const response = await axios.post(
        "https://b1r5aq31x2.execute-api.us-east-1.amazonaws.com/Prod/query/license",
        {}
      );
      this.setState({ licenses: response.data.payload.records, error: null });
    } catch (error) {
      this.setState({ error: error.message, licenses: [] });
    }
  };

  render() {
    const { licenses, error } = this.state;

    return (
      <div>
        <h2>License List</h2>
        {licenses.map((license) => (
          <div key={license.id}>
            <h3>{license.name}</h3>
            <p>Software ID: {license.software}</p>
            <p>Type: {license.type}</p>
            <p>Description: {license.description}</p>
            <p>Price: {license.price}</p>
            <img src={license.image} alt={license.name} />
            <p>Status: {license.status}</p>
            <p>Company: {license.company}</p>
            <p>Owner: {license.owner}</p>
          </div>
        ))}
        {error && (
          <div>
            <h2>Error:</h2>
            <p>{error}</p>
          </div>
        )}
      </div>
    );
  }
}
