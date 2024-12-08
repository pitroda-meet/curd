import { useState } from "react";

import "./App.css";
import AppNavbar from "./components/AppNavbar";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <>
      <AppNavbar />
      <main className="my-3">
        <Outlet />
      </main>{" "}
      <Footer />
    </>
  );
}

export default App;
