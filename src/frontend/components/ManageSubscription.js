import React, { Component } from "react";
import { ethers } from "ethers";
import FixedSubscriptionAbi from "../contractsData/FixedSubscriptionLicense.json";
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Card,
} from "@mui/material";

export default class ManageSubscription extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contractAddress: "",
      tokenId: "",
      isOwner: false,
      response: null,
      error: null,
      txDialogOpen: false,
      snackbarOpen: false,
    };

    this.provider = new ethers.providers.Web3Provider(window.ethereum);
    this.handleChange = this.handleChange.bind(this);
    this.checkOwnership = this.checkOwnership.bind(this);
    this.updateSubscription = this.updateSubscription.bind(this);
    this.cancelSubscription = this.cancelSubscription.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
  }

  handleChange(event) {
    const inputValue = event.target.value;
    const stateField = event.target.name;
    this.setState({
      [stateField]: inputValue,
    });
  }

  async checkOwnership() {
    const { contractAddress, tokenId } = this.state;
    const contract = new ethers.Contract(
      contractAddress,
      FixedSubscriptionAbi.abi,
      this.provider.getSigner()
    );
    const owner = await contract.ownerOf(tokenId);
    console.log(owner);
    if (owner) {
      if (owner.toLowerCase() === this.props.account.toLowerCase()) {
        this.setState({ isOwner: true, error: null });
      } else {
        this.setState({
          isOwner: false,
          error: "User is not permitted to update or cancel this subscription",
        });
      }
    } else {
      this.setState({
        isOwner: false,
        error: "No owner found for this tokenId",
      });
    }
  }

  async updateSubscription() {
    const { contractAddress, tokenId } = this.state;
    const contract = new ethers.Contract(
      contractAddress,
      FixedSubscriptionAbi.abi,
      this.provider.getSigner()
    );

    try {
      const tx = await contract.updateSubscription(tokenId);
      this.setState({ response: tx, error: null, txDialogOpen: true });
    } catch (error) {
      this.setState({
        error: error.message,
        response: null,
        snackbarOpen: true,
      });
    }
  }

  async cancelSubscription() {
    const { contractAddress, tokenId } = this.state;
    const contract = new ethers.Contract(
      contractAddress,
      FixedSubscriptionAbi.abi,
      this.provider.getSigner()
    );

    try {
      const tx = await contract.cancelSubscription(tokenId);
      this.setState({ response: tx, error: null, txDialogOpen: true });
    } catch (error) {
      this.setState({
        error: error.message,
        response: null,
        snackbarOpen: true,
      });
    }
  }

  handleDialogClose() {
    this.setState({ txDialogOpen: false });
  }

  handleSnackbarClose() {
    this.setState({ snackbarOpen: false });
  }

  render() {
    const {
      contractAddress,
      tokenId,
      isOwner,
      response,
      error,
      txDialogOpen,
      snackbarOpen,
    } = this.state;

    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "40vh",
            padding: 3,
          }}
        >
          <Card sx={{ width: "100%", padding: 3, textAlign: "center" }}>
            <Typography variant="h4" component="h1" align="center" gutterBottom>
              Manage Subscription
            </Typography>
            <Box component="form" sx={{ mt: 2 }}>
              <TextField
                label="Contract Address"
                value={contractAddress}
                name="contractAddress"
                onChange={this.handleChange}
                fullWidth
              />
              <TextField
                label="Token ID"
                value={tokenId}
                name="tokenId"
                onChange={this.handleChange}
                fullWidth
                sx={{ mt: 2 }}
              />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={this.checkOwnership}
                sx={{ mt: 2 }}
              >
                Check Ownership
              </Button>
              {isOwner ? (
                <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                  <Button
                    variant="contained"
                    color="secondary"
                    fullWidth
                    onClick={this.updateSubscription}
                  >
                    Update Subscription
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    fullWidth
                    onClick={this.cancelSubscription}
                  >
                    Cancel Subscription
                  </Button>
                </Box>
              ) : (
                error && <Alert severity="error">{error}</Alert>
              )}
            </Box>
            {/* {response && (
              <div>
                <Typography variant="h5" gutterBottom>
                  Response:
                </Typography>
                <pre>{JSON.stringify(response, null, 2)}</pre>
              </div>
            )} */}
          </Card>
        </Box>
        <Dialog open={txDialogOpen} onClose={this.handleDialogClose}>
          <DialogTitle>{"Transaction Confirmation"}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {`Transaction has been sent to the blockchain network. Here is the response: \n ${JSON.stringify(
                response,
                null,
                2
              )}`}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleDialogClose}>Close</Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={this.handleSnackbarClose}
          message={error}
          action={
            <Button
              color="secondary"
              size="small"
              onClick={this.handleSnackbarClose}
            >
              Close
            </Button>
          }
        />
      </Container>
    );
  }
}
