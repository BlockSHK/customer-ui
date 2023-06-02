import React, { Component } from "react";
import { ethers } from "ethers";
import PerpetualLicenseAbi from "../contractsData/PerpetualLicense.json";
import LicenseActivation from "../contractsData/LicenseActivation.json";
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
} from "@mui/material";

export default class ActivateLicense extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: "",
      contractAddress: "",
      tokenId: "",
      hash: "",
      signedHash: "",
      isOwner: false,
      licenseActivated: false,
      licenseContractAddress: "",
      error: null,
      response: null,
    };

    this.provider = new ethers.providers.Web3Provider(window.ethereum);
    this.handleChange = this.handleChange.bind(this);
    this.checkOwnership = this.checkOwnership.bind(this);
    this.checkActivation = this.checkActivation.bind(this);
    this.activateLicense = this.activateLicense.bind(this);
    this.deactivateLicense = this.deactivateLicense.bind(this);
    this.signHash = this.signHash.bind(this);
    this.connectWallet = this.connectWallet.bind(this);
  }

  async componentDidMount() {
    await this.connectWallet();
  }

  async connectWallet() {
    if (!window.ethereum) {
      this.setState({
        error: "Please install Metamask extension in your browser.",
      });
      return;
    }
    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      this.setState({ account: accounts[0] });
    } catch (error) {
      this.setState({
        error: "You need to allow Metamask to connect to this application",
      });
    }
  }

  async componentDidUpdate(prevProps, prevState) {
    if (
      prevState.contractAddress !== this.state.contractAddress &&
      this.state.contractAddress !== ""
    ) {
      await this.getContractAddress();
    }
  }

  async getContractAddress() {
    const { contractAddress } = this.state;
    const contract = new ethers.Contract(
      contractAddress,
      PerpetualLicenseAbi.abi,
      this.provider.getSigner()
    );

    try {
      const licenseContractAddress =
        await contract.getLicenseActivationContractAddress();
      console.log(licenseContractAddress);
      this.setState({ licenseContractAddress });
    } catch (err) {
      this.setState({
        licenseContractAddress: "",
        error:
          "Error while fetching the license contract address: " + err.message,
      });
    }
  }

  handleChange(event) {
    const inputValue = event.target.value;
    const stateField = event.target.name;
    this.setState({
      [stateField]: inputValue,
    });
  }
  async checkActivation() {
    const { licenseContractAddress, tokenId } = this.state;
    const contract = new ethers.Contract(
      licenseContractAddress,
      LicenseActivation.abi,
      this.provider.getSigner()
    );
    try {
      const isLicenseActivated = await contract.isLicenseActivated(tokenId);
      this.setState({ licenseActivated: isLicenseActivated });
    } catch (err) {
      this.setState({
        licenseActivated: false,
        error: "Error while checking license activation status: " + err.message,
      });
    }
  }

  async checkOwnership() {
    const { contractAddress, tokenId } = this.state;
    const contract = new ethers.Contract(
      contractAddress,
      PerpetualLicenseAbi.abi,
      this.provider.getSigner()
    );
    try {
      const owner = await contract.ownerOf(tokenId);
      console.log(owner);
      if (owner) {
        if (owner.toLowerCase() === this.props.account.toLowerCase()) {
          this.setState({ isOwner: true, error: null });
          await this.checkActivation();
        } else {
          this.setState({
            isOwner: false,
            error: "User is not the owner of this license contract",
          });
        }
      } else {
        this.setState({
          isOwner: false,
          error: "No owner found for this license contract",
        });
      }
    } catch (err) {
      this.setState({
        isOwner: false,
        error: "Error while checking ownership: " + err.message,
      });
    }
  }

  async activateLicense() {
    const { licenseContractAddress, tokenId, hash, signedHash } = this.state;
    console.log(licenseContractAddress, tokenId, hash, signedHash);
    const contract = new ethers.Contract(
      licenseContractAddress,
      LicenseActivation.abi,
      this.provider.getSigner()
    );

    // Create a hash of the message
    const messageHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(hash));

    try {
      const tx = await contract.activateLicense(
        tokenId,
        messageHash,
        signedHash // Pass the split signature
      );
      this.setState({ response: tx, error: null });
    } catch (error) {
      this.setState({ error: error.message, response: null });
    }
  }

  async deactivateLicense() {
    const { licenseContractAddress, tokenId } = this.state;
    const contract = new ethers.Contract(
      licenseContractAddress,
      LicenseActivation.abi,
      this.provider.getSigner()
    );

    try {
      const tx = await contract.deactivateLicense(tokenId);
      this.setState({ response: tx, error: null });
    } catch (error) {
      this.setState({ error: error.message, response: null });
    }
  }

  async signHash() {
    const signer = this.provider.getSigner();
    const { hash } = this.state;

    try {
      // Create a hash of the message
      const messageHash = ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes(hash)
      );
      // Sign the hashed message
      const signature = await signer.signMessage(
        ethers.utils.arrayify(messageHash)
      );
      this.setState({ signedHash: signature });
    } catch (err) {
      this.setState({ error: "Error while signing hash: " + err.message });
    }
  }

  render() {
    const {
      contractAddress,
      tokenId,
      hash,
      signedHash,
      isOwner,
      licenseActivated,
      response,
      error,
    } = this.state;

    return (
      <Container maxWidth="sm">
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Activate License
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
          {isOwner && !licenseActivated ? (
            <>
              <TextField
                label="Hash"
                value={hash}
                name="hash"
                onChange={this.handleChange}
                fullWidth
                sx={{ mt: 2 }}
              />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={this.signHash}
                sx={{ mt: 2 }}
              >
                Sign Hash
              </Button>
              <TextField
                label="Signed Hash"
                value={signedHash}
                name="signedHash"
                onChange={this.handleChange}
                fullWidth
                sx={{ mt: 2 }}
              />
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                onClick={this.activateLicense}
                sx={{ mt: 2 }}
              >
                Activate License
              </Button>
            </>
          ) : (
            <>
              {isOwner && licenseActivated && (
                <Button
                  variant="contained"
                  color="error"
                  fullWidth
                  onClick={this.deactivateLicense}
                  sx={{ mt: 2 }}
                >
                  Deactivate License
                </Button>
              )}
              {error && <Alert severity="error">{error}</Alert>}
            </>
          )}
        </Box>
        {response && (
          <div>
            <Typography variant="h5" gutterBottom>
              Response:
            </Typography>
            <pre>{JSON.stringify(response, null, 2)}</pre>
          </div>
        )}
      </Container>
    );
  }
}
