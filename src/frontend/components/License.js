import React, { Component } from "react";
import axios from "axios";
import { ethers } from "ethers";
import PerpetualLicenseAbi from "../contractsData/PerpetualLicense.json";
import FixedSubscriptionAbi from "../contractsData/FixedSubscriptionLicense.json";
import AutoRenewSubscriptionAbi from "../contractsData/AutoRenewSubscriptionLicense.json";

export default class License extends Component {
  constructor(props) {
    super(props);
    this.state = {
      licenses: [],
      error: null,
    };

    this.provider = new ethers.providers.Web3Provider(window.ethereum);
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

  buyToken = async (license) => {
    const contractAbi =
      license.type === "CONTRACT_PERPETUAL"
        ? PerpetualLicenseAbi.abi
        : license.type === "CONTRACT_FIXED_SUBSCRIPTION"
        ? FixedSubscriptionAbi.abi
        : AutoRenewSubscriptionAbi.abi;

    const contract = new ethers.Contract(
      license.contract.address,
      contractAbi,
      this.provider.getSigner()
    );
    try {
      const tx = await contract.buyToken({
        value: license.price,
      }); // replace "1.0" with the appropriate price
      console.log(tx);
    } catch (error) {
      console.error(error);
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
            <button onClick={() => this.buyToken(license)}>Buy Token</button>
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
