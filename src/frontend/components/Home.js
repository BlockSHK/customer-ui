import React from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import Slider from "react-slick"; // you need to install this package
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import microsoft_logo from "./images/microsoft.webp";
import { styled } from "@mui/material/styles";

const Home = () => (
  <Box>
    <BackgroundSlider />
    <HowItWorks />
    <Founders />
  </Box>
);

const Image = styled("img")({
  width: "100%",
  height: "40vh",
  objectFit: "cover",
});

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
};

const BackgroundSlider = () => (
  <Box sx={{ width: "100%", height: "40vh", overflow: "hidden" }}>
    <Slider {...sliderSettings}>
      <Image src={microsoft_logo} alt="Image 1" />
      <Image src={microsoft_logo} alt="Image 2" />
      <Image src={microsoft_logo} alt="Image 3" />
    </Slider>
  </Box>
);

const Founders = () => (
  <Grid container spacing={2}>
    <Grid item xs={4}>
      <Founder
        name="Name1"
        image="/path/to/image1.jpg"
        description="Description1"
      />
    </Grid>
    <Grid item xs={4}>
      <Founder
        name="Name2"
        image="/path/to/image2.jpg"
        description="Description2"
      />
    </Grid>
    <Grid item xs={4}>
      <Founder
        name="Name3"
        image="/path/to/image3.jpg"
        description="Description3"
      />
    </Grid>
  </Grid>
);

const Founder = ({ name, image, description }) => (
  <Paper>
    <img src={image} alt={name} />
    <Typography variant="h6">{name}</Typography>
    <Typography>{description}</Typography>
  </Paper>
);

const HowItWorks = () => (
  <Box>
    <Typography variant="h4">How It Works</Typography>
    <Typography>Here you describe how the application works.</Typography>
    <Typography>Here you describe how the application works.</Typography>
    <Typography>Here you describe how the application works.</Typography>
    <Typography>Here you describe how the application works.</Typography>
    <Typography>Here you describe how the application works.</Typography>
    <Typography>Here you describe how the application works.</Typography>
  </Box>
);

export default Home;
