import { createBrowserRouter } from "react-router";
import RootLayout from "../Layouts/RootLayout/RootLayout";
import Login from "@/pages/Login/Login";
import Register from "@/pages/Register/Register";
import Home from "@/pages/Home/Home/Home";
import DashboardLayout from "@/Layouts/Dashboard/DashboardLayout";
import Dashboard from "@/pages/Dashboard/Dashboard/Dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
    ],
  },
]);
