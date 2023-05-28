import React, { Component } from "react";
import axios from "axios";
import { ethers } from "ethers";
import PerpetualLicenseAbi from "../contractsData/PerpetualLicense.json";
import FixedSubscriptionAbi from "../contractsData/FixedSubscriptionLicense.json";
import AutoRenewSubscriptionAbi from "../contractsData/AutoRenewSubscriptionLicense.json";
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Typography,
  Grid,
  Container,
} from "@mui/material";

export default class BuyLicense extends Component {
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
      <Container maxWidth="md">
        <Typography variant="h2" align="center" gutterBottom>
          License List
        </Typography>

        <Grid container spacing={4}>
          {licenses.map((license) => (
            <Grid item key={license.id} xs={12} sm={6} md={4}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={license.image}
                  alt={license.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {license.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Software ID: {license.software}
                    <br />
                    Type: {license.type}
                    <br />
                    Description: {license.description}
                    <br />
                    Price: {license.price}
                    <br />
                    Status: {license.status}
                    <br />
                    Company: {license.company}
                    <br />
                    Owner: {license.owner}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => this.buyToken(license)}
                  >
                    Buy Token
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {error && (
          <div>
            <h2>Error:</h2>
            <p>{error}</p>
          </div>
        )}
      </Container>
    );
  }
}
