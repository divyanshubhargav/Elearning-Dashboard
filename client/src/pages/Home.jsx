//* Packages Imports */
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const Home = () => (
  <Container
    maxWidth={false}
    disableGutters
    sx={{ padding: 0, overflow: "hidden", height: "100vh" }}
  >
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        p: { xs: 2, md: 4 },
        bgcolor: "primary.light",
        backgroundImage: "linear-gradient(to right, #1E3C72, #2A5298)",
      }}
    >
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        sx={{
          fontSize: { xs: "2rem", md: "3rem" },
          fontWeight: "bold",
          color: "white",
        }}
      >
        Welcome to E-Learning Dashboard
      </Typography>

      <Typography
        variant="h6"
        sx={{ color: "white", mb: 3, maxWidth: "600px" }}
      >
        Learn new skills, explore courses, and grow your knowledge with us.
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
        }}
      >
        <Button
          variant="contained"
          color="secondary"
          component={Link}
          to="/login"
          sx={{ fontSize: "1rem", px: 4, py: 1 }}
        >
          Login
        </Button>
        <Button
          variant="outlined"
          sx={{
            fontSize: "1rem",
            px: 4,
            py: 1,
            color: "white",
            borderColor: "white", 
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.2)",
            },
          }}
          component={Link}
          to="/register"
        >
          Register
        </Button>
      </Box>
    </Box>
  </Container>
);

export default Home;
