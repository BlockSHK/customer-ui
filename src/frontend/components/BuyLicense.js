import React, { Component } from "react";
import axios from "axios";
import { ethers } from "ethers";
import { Box, CircularProgress } from "@mui/material";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

export default class BuyLicense extends Component {
  constructor(props) {
    super(props);
    this.state = {
      licenses: [],
      error: null,
      openDialog: false,
      dialogTitle: "",
      dialogContent: "",
      transactionInProgress: false,
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
    this.setState({ transactionInProgress: true });

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
      let tx;
      if (license.type === "CONTRACT_AUTO_RENEW_SUBSCRIPTION") {
        tx = await contract.buyToken();
      } else {
        tx = await contract.buyToken({
          value: ethers.BigNumber.from(license.price.toString()),
          gasLimit: ethers.utils.hexlify(100000),
        });
      }

      const receipt = await tx.wait();
      console.log(receipt);
      const tokenId = ethers.BigNumber.from(
        receipt.logs[0].topics[3]
      ).toString(); // convert hex to decimal
      this.setState({
        openDialog: true,
        dialogTitle: "Transaction Successful",
        dialogContent: `Token ID: ${tokenId}`,
        transactionInProgress: false,
      });
    } catch (error) {
      this.setState({ error: error.message, transactionInProgress: false });
    }
  };

  handleCloseDialog = () => {
    this.setState({ openDialog: false });
  };

  renderLicenseCards = (licenses) => {
    return licenses.map((license) => (
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
    ));
  };

  renderLicenseSection = (licenses, title) => {
    return (
      <div>
        <Typography variant="h4" align="left" gutterBottom>
          {title}
        </Typography>
        {licenses.length > 0 ? (
          <Grid container spacing={4}>
            {this.renderLicenseCards(licenses)}
          </Grid>
        ) : (
          <Typography variant="h6" align="center" gutterBottom>
            No Licenses
          </Typography>
        )}
      </div>
    );
  };

  render() {
    const {
      licenses,
      error,
      openDialog,
      dialogTitle,
      dialogContent,
      transactionInProgress,
    } = this.state;

    const perpetualLicenses = licenses.filter(
      (license) => license.type === "CONTRACT_PERPETUAL"
    );
    const fixedSubscriptionLicenses = licenses.filter(
      (license) => license.type === "CONTRACT_FIXED_SUBSCRIPTION"
    );
    const autoRenewSubscriptionLicenses = licenses.filter(
      (license) => license.type === "CONTRACT_AUTO_RENEW_SUBSCRIPTION"
    );

    return (
      <Container maxWidth="md">
        <Typography variant="h2" align="center" gutterBottom>
          License List
        </Typography>
        {transactionInProgress && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: 2,
              backgroundColor: "error.main",
              color: "white",
              borderRadius: 1,
              marginTop: 2,
            }}
          >
            <CircularProgress color="inherit" />
            <Typography variant="h6" align="center" gutterBottom>
              Transaction in progress, please wait...
            </Typography>
          </Box>
        )}

        {this.renderLicenseSection(perpetualLicenses, "Perpetual Licenses")}
        {this.renderLicenseSection(
          fixedSubscriptionLicenses,
          "Fixed Subscription Licenses"
        )}
        {this.renderLicenseSection(
          autoRenewSubscriptionLicenses,
          "Auto Renew Subscription Licenses"
        )}

        {error && (
          <div>
            <h2>Error:</h2>
            <p>{error}</p>
          </div>
        )}

        <Dialog open={openDialog} onClose={this.handleCloseDialog}>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogContent>
            <DialogContentText>{dialogContent}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseDialog}>Close</Button>
          </DialogActions>
        </Dialog>
      </Container>
    );
  }
}
