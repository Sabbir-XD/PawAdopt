import React from "react";
import Navbar from "../../Shared/Navbar/Navbar";
import { Outlet } from "react-router";
import { ToastContainer } from "react-toastify";

const RootLayout = () => {
  return (
    <div>
    <ToastContainer position="top-right" autoClose={3000} hideProgressBar newestOnTop />
      <Navbar />
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default RootLayout;
