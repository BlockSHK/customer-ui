import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./Navbar";
import Home from "./Home.js";
import { useState } from "react";
import { ethers } from "ethers";
import { Spinner } from "react-bootstrap";
import "./App.css";
import SignMessage from "./SignMessage";
import BuyLicense from "./BuyLicense";
import ManageSubscription from "./ManageSubscription";
import ActivateLicense from "./ActivateLicense";
import Footer from "./Footer";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#123456", // You should change this to the color you want
    },
    // Define other parts of the theme as needed
  },
});

function App() {
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState(null);

  // MetaMask Login/Connect
  const web3Handler = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setAccount(accounts[0]);

    // Get provider from Metamask
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // Set signer
    const signer = provider.getSigner();

    window.ethereum.on("chainChanged", (chainId) => {
      window.location.reload();
    });

    window.ethereum.on("accountsChanged", async function (accounts) {
      setAccount(accounts[0]);
      await web3Handler();
    });

    setLoading(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <div
          className="App"
          style={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          }}
        >
          <Navigation web3Handler={web3Handler} account={account} />
          <div style={{ flex: 1 }}>
            {loading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "80vh",
                }}
              >
                <Spinner animation="border" style={{ display: "flex" }} />
                <p className="mx-3 my-0">Awaiting Metamask Connection...</p>
              </div>
            ) : (
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/customer-ui/" element={<Home />} />
                <Route
                  path="/customer-ui/buy-license"
                  element={<BuyLicense />}
                />
                <Route
                  path="/customer-ui/manage-subscription"
                  element={<ManageSubscription account={account} />}
                />

                <Route
                  path="/customer-ui/sign-message"
                  element={<SignMessage />}
                />
                <Route
                  path="/customer-ui/activate-license"
                  element={<ActivateLicense account={account} />}
                />
              </Routes>
            )}
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
