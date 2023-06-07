import { Link as RouterLink } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Link,
  Box,
  IconButton,
  Container,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { styled } from "@mui/system";
import logo from "./BlockSHK.png";

const CustomButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
}));

const NavLink = styled(Link)(({ theme }) => ({
  margin: theme.spacing(1),
  color: "#ffffff",
}));

const LinkBox = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

const Navigation = ({ web3Handler, account }) => {
  return (
    <AppBar
      position="static"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Container>
        <Toolbar
          variant="dense"
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <Box display="flex" alignItems="center">
            <IconButton edge="start" color="inherit" aria-label="menu">
              <img src={logo} width="40" height="40" alt="" />
            </IconButton>
            <Typography variant="h6" component="div">
              BlockSHK
            </Typography>
          </Box>
          <LinkBox>
            <NavLink component={RouterLink} to="/">
              Home
            </NavLink>
            <NavLink component={RouterLink} to="/buy-license">
              Buy License
            </NavLink>
            <NavLink component={RouterLink} to="/manage-subscription">
              Manage Subscription
            </NavLink>
            <NavLink component={RouterLink} to="/sign-message">
              Sign Message
            </NavLink>
            <NavLink component={RouterLink} to="/activate-license">
              Activate License
            </NavLink>
            {account ? (
              <Link
                href={`https://etherscan.io/address/${account}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <CustomButton variant="contained" color="primary">
                  {account.slice(0, 5) + "..." + account.slice(38, 42)}
                </CustomButton>
              </Link>
            ) : (
              <CustomButton
                onClick={web3Handler}
                variant="contained"
                color="primary"
              >
                Connect Wallet
              </CustomButton>
            )}
          </LinkBox>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navigation;
