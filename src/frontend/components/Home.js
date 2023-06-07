import React from "react";
import {
  Box,
  Typography,
  Container,
  Button,
  Card,
  CardContent,
  CardMedia,
  Link,
  Grid,
} from "@mui/material";
import { styled } from "@mui/system";
import microsoftImage from "./images/microsoft.webp";
import oracleImage from "./images/oracle.webp";
import adobeImage from "./images/adobe.png";
import backgroundImage from "./images/background.jpg";
import { Link as RouterLink } from "react-router-dom";

const NavLink = styled(Link)(({ theme }) => ({
  margin: theme.spacing(1),
  color: "#ffffff",
}));

const BackgroundImage = styled("div")({
  backgroundImage: `url(${backgroundImage})`,
  height: "60vh",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  position: "relative",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "#fff",
  fontSize: "4em",
  textAlign: "center",
});
export default function Home() {
  return (
    <div>
      <BackgroundImage>BlockSHK License Management</BackgroundImage>
      <Container maxWidth="lg">
        <Box py={5} textAlign="center">
          <Typography variant="h2" gutterBottom>
            Welcome to BlockSHK
          </Typography>
          <Typography variant="h5" gutterBottom>
            The next generation of software subscription and licensing
            management is here.
          </Typography>
          <Typography variant="body1" gutterBottom>
            BlockSHK is a blockchain based system for managing software licenses
            and subscription. We provide secure and tamper-proof licenses for
            all types of software, from desktop applications to web services.
            Our system is built on the latest blockchain technologies, ensuring
            that your licenses are safe and can't be duplicated and enhancing
            user Control.
          </Typography>
          <Box mt={3}>
            <NavLink component={RouterLink} to="/customer-ui/buy-license">
              <Button variant="contained" color="primary" size="large">
                Buy a License
              </Button>
            </NavLink>
          </Box>
        </Box>
        <Box py={5}>
          <Typography variant="h4" gutterBottom>
            Our Partners
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={microsoftImage}
                  alt="Microsoft"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Microsoft
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Microsoft, our esteemed partner, provides a vast range of
                    software licenses catering to different needs. Leverage our
                    blockchain platform to manage and transfer these licenses
                    with absolute ease and transparency.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={adobeImage}
                  alt="Adobe"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Adobe
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    We are proud to partner with Adobe, offering numerous
                    digital licenses for creative software. Buy, sell, or trade
                    Adobe licenses through our blockchain system, ensuring full
                    security and clarity in every transaction.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={oracleImage}
                  alt="Oracle"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Oracle
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Our partnership with Oracle facilitates the management of
                    complex database and middleware licenses. Utilize our
                    blockchain-powered platform to handle Oracle licenses
                    effortlessly, all while maintaining impeccable record
                    integrity.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </div>
  );
}
