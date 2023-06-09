import React, { Component } from "react";
import axios from "axios";
import { ethers } from "ethers";
import {
  Box,
  CircularProgress,
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
  Paper,
  styled,
} from "@mui/material";
import PerpetualLicenseAbi from "../contractsData/PerpetualLicense.json";
import FixedSubscriptionAbi from "../contractsData/FixedSubscriptionLicense.json";
import AutoRenewSubscriptionAbi from "../contractsData/AutoRenewSubscriptionLicense.json";

import backgroundImage from "./images/background_2.jpg";

const BackgroundImage = styled("div")({
  backgroundImage: `url(${backgroundImage})`,
  height: "100%",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  backgroundAttachment: "fixed",
  position: "absolute",
  width: "100%",
  overflow: "auto",
  top: 0,
  left: 0,
});

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
      transactionComplete: false,
      loading: true,
      licenseDetail: null,
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
      this.setState({
        licenses: response.data.payload.records,
        loading: false,
      });
    } catch (error) {
      this.setState({ error: error.message, loading: false });
    }
  };

  buyToken = async (license) => {
    this.setState({
      transactionInProgress: true,
      dialogTitle: "Transaction In Progress",
      dialogContent: "To start the transaction, please confirm in MetaMask.",
    });

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
        const overrides = {
          gasLimit: 5000000, // specify the gas limit as a property in the overrides object
        };
        tx = await contract.buyToken(overrides);
      } else {
        tx = await contract.buyToken({
          value: ethers.BigNumber.from(license.price.toString()),
        });
      }

      const receipt = await tx.wait();
      console.log(receipt);
      const tokenId = ethers.BigNumber.from(
        receipt.logs[0].topics[3]
      ).toString(); // convert hex to decimal
      this.setState({
        dialogTitle: "Transaction Successful",
        dialogContent: `Token ID: ${tokenId}`,
        transactionComplete: true,
      });
    } catch (error) {
      this.setState({ error: error.message, transactionInProgress: false });
    }
  };

  handleCloseDialog = () => {
    this.setState({
      openDialog: false,
      dialogTitle: "",
      dialogContent: "",
      transactionInProgress: false,
      transactionComplete: false,
      licenseDetail: null,
    });
  };
  handleCloseTransactionDialog = () => {
    this.setState({
      transactionInProgress: false,
      transactionComplete: false,
      openDialog: false,
      dialogTitle: "",
      dialogContent: "",
    });
  };
  handleOpenLicenseDetail = (license) => {
    this.setState({ licenseDetail: license, openDialog: true });
  };

  convertWeiToEther = (wei) => {
    return ethers.utils.formatEther(wei);
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
              Price:{" "}
              {license.type === "CONTRACT_AUTO_RENEW_SUBSCRIPTION"
                ? license.price
                : this.convertWeiToEther(license.price)}
              <br />
              {license.type === "CONTRACT_FIXED_SUBSCRIPTION" && (
                <div>Subscription Period: {license.subscriptionPeriod}</div>
              )}
              {license.type === "CONTRACT_AUTO_RENEW_SUBSCRIPTION" && (
                <div>
                  Subscription Period: {license.subscriptionPeriod}
                  <br />
                  Payment Token: {license.paymentToken}
                </div>
              )}
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              size="small"
              color="primary"
              onClick={() => this.handleOpenLicenseDetail(license)}
            >
              View
            </Button>
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
      <Box component={Paper} p={2} mt={2} mb={2}>
        <Typography variant="h5" align="left" gutterBottom>
          {title}
        </Typography>
        {licenses.length > 0 ? (
          <Grid container spacing={4}>
            {this.renderLicenseCards(licenses)}
          </Grid>
        ) : (
          <Typography variant="body1" align="center">
            No Licenses
          </Typography>
        )}
      </Box>
    );
  };

  renderLicenseDetailDialog = (license) => {
    return (
      <Dialog open={this.state.openDialog} onClose={this.handleCloseDialog}>
        <DialogTitle>{license ? license.name : ""}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Software ID: {license ? license.software : ""}
          </DialogContentText>
          <DialogContentText>
            Type: {license ? license.type : ""}
          </DialogContentText>
          <DialogContentText>
            Description: {license ? license.description : ""}
          </DialogContentText>
          <DialogContentText>
            Price:{" "}
            {license
              ? license.type === "CONTRACT_AUTO_RENEW_SUBSCRIPTION"
                ? license.price
                : this.convertWeiToEther(license.price)
              : ""}
          </DialogContentText>
          <DialogContentText>
            Status: {license ? license.status : ""}
          </DialogContentText>
          <DialogContentText>
            Contract: {license ? license.contract.address : ""}
          </DialogContentText>
          <DialogContentText>
            Company: {license ? license.company : ""}
          </DialogContentText>
          <DialogContentText>
            Owner: {license ? license.owner : ""}
          </DialogContentText>
          {license && license.type === "CONTRACT_FIXED_SUBSCRIPTION" && (
            <DialogContentText>
              Subscription Period: {license.subscriptionPeriod}
            </DialogContentText>
          )}
          {license && license.type === "CONTRACT_AUTO_RENEW_SUBSCRIPTION" && (
            <div>
              <DialogContentText>
                Subscription Period: {license.subscriptionPeriod}
              </DialogContentText>
              <DialogContentText>
                Payment Token: {license.paymentToken}
              </DialogContentText>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  };
  render() {
    const { licenses, error, loading, licenseDetail } = this.state;

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
      <BackgroundImage>
        <div style={{ position: "relative" }}>
          <Container maxWidth="md">
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "40vh",
                marginTop: "10vh",
                marginBottom: "10vh",
              }}
            >
              <Card sx={{ width: "100%", padding: 1, textAlign: "center" }}>
                <Box mt={4} mb={2}>
                  <Typography variant="h4" align="center" gutterBottom>
                    Buy Your License Here
                  </Typography>
                </Box>

                {loading ? (
                  <Box display="flex" justifyContent="center" mt={5}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <>
                    {this.renderLicenseSection(
                      perpetualLicenses,
                      "Perpetual Licenses"
                    )}
                    {this.renderLicenseSection(
                      fixedSubscriptionLicenses,
                      "Fixed Subscription Licenses"
                    )}
                    {this.renderLicenseSection(
                      autoRenewSubscriptionLicenses,
                      "Auto Renew Subscription Licenses"
                    )}
                  </>
                )}

                {error && (
                  <Box color="error.main" mt={2}>
                    <Typography variant="h6">Error:</Typography>
                    <Typography variant="body1">{error}</Typography>
                  </Box>
                )}

                {this.renderLicenseDetailDialog(licenseDetail)}

                <Dialog
                  open={
                    this.state.transactionInProgress ||
                    this.state.transactionComplete
                  }
                  onClose={
                    this.state.transactionComplete
                      ? this.handleCloseDialog
                      : undefined
                  }
                >
                  <DialogTitle>{this.state.dialogTitle}</DialogTitle>
                  <DialogContent>
                    {!this.state.transactionComplete && <CircularProgress />}
                    <DialogContentText>
                      {this.state.dialogContent}
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={this.handleCloseDialog}>Close</Button>
                  </DialogActions>
                </Dialog>
              </Card>
            </Box>
          </Container>
        </div>
      </BackgroundImage>
    );
  }
}
