import React from "react";
import Navbar from "../../Shared/Navbar/Navbar";
import { Outlet } from "react-router";
import { ToastContainer } from "react-toastify";
import Footer from "@/Shared/Footer/Footer";

const RootLayout = () => {
  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
      />
      <Navbar />
      <div>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default RootLayout;
