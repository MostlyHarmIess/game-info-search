import React from "react";
import { Outlet } from "react-router-dom";
import Container from "@mui/material/Container";
import Header from "../components/Header";

function Layout() {
  return (
    <>
      <Header />
      <Container maxWidth="xl">
        <Outlet />
      </Container>

      <footer />
    </>
  );
}

export default Layout;
