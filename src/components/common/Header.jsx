import React from "react";
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import Container from '@mui/material/Container';
import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    <AppBar className='app-bar' position='static'>
      <Container maxWidth='xl' style={{ width: "80vw", textAlign: "left", height: "50px"}}>
        <NavLink to='/' className='app-logo'>
          <Typography className='app-logo' variant='h6' component='div' sx={{ flexGrow: 1, lineHeight: "3rem" }}>
            Cardsorting
          </Typography>
        </NavLink>
      </Container>
    </AppBar>
  );
}
