//* Packages Imports */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import useMediaQuery from "@mui/material/useMediaQuery";
import MenuIcon from "@mui/icons-material/Menu";


//* Utils Imports */
import { logout } from "../store/authSlice";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery("(max-width:768px)");
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };


  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <AppBar position="static" sx={{ bgcolor: "primary.dark" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          component={Link}
          to="/dashboard"
          sx={{
            color: "white",
            textDecoration: "none",
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          E-learning
        </Typography>

        {/* Desktop Navigation */}
        {!isMobile ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography
              component={Link}
              to="/courses"
              sx={{
                color: "white",
                textDecoration: "none",
                fontSize: 16,
                "&:hover": { color: "#93c5fd" },
              }}
            >
              Courses
            </Typography>
            <Typography
              component={Link}
              to="/dashboard"
              sx={{
                color: "white",
                textDecoration: "none",
                fontSize: 16,
                "&:hover": { color: "#93c5fd" },
              }}
            >
              Dashboard
            </Typography>
            <Button
              variant="contained"
              color="error"
              onClick={handleLogout}
              sx={{ textTransform: "none", px: 2, py: 1, borderRadius: 1 }}
            >
              Logout
            </Button>
          </Box>
        ) : (
          // Mobile Navigation: Hamburger Menu
          <>
            <IconButton color="inherit" onClick={handleMenuOpen}>
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              sx={{ mt: 1 }}
            >
              <MenuItem component={Link} to="/courses" onClick={handleMenuClose}>
                Courses
              </MenuItem>
              <MenuItem component={Link} to="/dashboard" onClick={handleMenuClose}>
                Dashboard
              </MenuItem>
              <MenuItem onClick={() => { handleMenuClose(); handleLogout(); }}>
                Logout
              </MenuItem>
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
