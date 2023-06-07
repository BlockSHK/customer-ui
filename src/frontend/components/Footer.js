import React from "react";
import { Box, Container, Typography, Link } from "@mui/material";
import { styled } from "@mui/system";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";

const FooterStyle = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: "#ffffff",
  padding: theme.spacing(3, 0),
  position: "sticky",
  bottom: 0,
  width: "100%",
}));

const Footer = () => {
  return (
    <FooterStyle component="footer">
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="body1">
            &copy; {new Date().getFullYear()} BlockSHK
          </Typography>
          <Box>
            <Link href="#" color="inherit" underline="none">
              Terms of Use
            </Link>
            {" | "}
            <Link href="#" color="inherit" underline="none">
              Privacy Policy
            </Link>
          </Box>
          <Box display="flex" alignItems="center">
            <Box display="flex" alignItems="center" marginX={2}>
              <EmailIcon />
              <Link
                href="mailto:BlockSHK@gmail.com"
                color="inherit"
                underline="none"
              >
                <Typography variant="body1" marginLeft={1}>
                  BlockSHK@gmail.com
                </Typography>
              </Link>
            </Box>
            <Box display="flex" alignItems="center">
              <PhoneIcon />
              <Link href="tel:(123) 456-7890" color="inherit" underline="none">
                <Typography variant="body1" marginLeft={1}>
                  (123) 456-7890
                </Typography>
              </Link>
            </Box>
          </Box>
        </Box>
      </Container>
    </FooterStyle>
  );
};

export default Footer;
