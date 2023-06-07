import React, { Component } from "react";
import { ethers } from "ethers";
import { Button, TextField, Typography, Card, Box } from "@mui/material";

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
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "40vh",
        }}
      >
        <Card sx={{ width: "50%", padding: 3, textAlign: "center" }}>
          <Typography variant="h4" gutterBottom>
            Sign Message
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            name="message"
            onChange={this.handleChange}
            value={this.state.message}
            placeholder="Enter a message to sign"
          />
          <Button variant="contained" onClick={this.signMessage} sx={{ mt: 3 }}>
            Sign Message
          </Button>
          {signedMessage && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6">Signed Message:</Typography>
              <Typography sx={{ wordWrap: "break-word" }}>
                {signedMessage}
              </Typography>
            </Box>
          )}
          {error && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6">Error:</Typography>
              <Typography>{error}</Typography>
            </Box>
          )}
        </Card>
      </Box>
    );
  }
}
