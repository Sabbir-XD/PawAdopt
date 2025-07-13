import { createBrowserRouter } from "react-router";
import RootLayout from "../Layouts/RootLayout/RootLayout";
import Login from "@/pages/Login/Login";
import Register from "@/pages/Register/Register";
import Home from "@/pages/Home/Home/Home";
import DashboardLayout from "@/Layouts/Dashboard/DashboardLayout";
import Dashboard from "@/pages/Dashboard/Dashboard/Dashboard";
import AddPetForm from "@/pages/Dashboard/AddPetForm/AddPetForm";
import PrivetRoute from "@/Routes/PrivetRoutes/PrivetRoutes";
import MyAddedPets from "@/pages/Dashboard/MyAddedPets/MyAddedPets";
import { TableRowSkeleton } from "@/components/Loading/Loading";
import UpdatePetForm from "@/pages/Dashboard/UpdatePetForm/UpdatePetForm";
import CreateDonationCampaign from "@/pages/Dashboard/CreateDonationCampaign/CreateDonationCampaign";
import MyDonationCampaigns from "@/pages/Dashboard/MyDonationCampaigns/MyDonationCampaigns";
import EditDonationCampaign from "@/pages/Dashboard/EditDonationCampaign/EditDonationCampaign";
import AdminRoutes from "@/Routes/AdminRoutes/AdminRoutes";
import AllUsersPage from "@/pages/Dashboard/AdminDashboard/AllUsersPage/AllUsersPage";
import ManagePet from "@/pages/Dashboard/AdminDashboard/ManagePet/ManagePet";
import PetListing from "@/pages/PetListing/PetListing";

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
      {
        path:"/pet-listing",
        element: <PetListing />
      }
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
      {
        path: "/dashboard/add-pet",
        element: (
          <PrivetRoute>
            <AddPetForm />
          </PrivetRoute>
        ),
      },
      {
        path: "/dashboard/my-pets",
        element: (
          <PrivetRoute skeleton={<TableRowSkeleton count={5} />}>
            <MyAddedPets />
          </PrivetRoute>
        ),
      },
      {
        path: "/dashboard/update-pet/:id",
        element: (
          <PrivetRoute>
            <UpdatePetForm />
          </PrivetRoute>
        ),
      },
      {
        path: "/dashboard/create-donation",
        element: (
          <PrivetRoute>
            <CreateDonationCampaign />
          </PrivetRoute>
        ),
      },
      {
        path: "/dashboard/my-donations",
        element: (
          <PrivetRoute>
            <MyDonationCampaigns />
          </PrivetRoute>
        ),
      },
      {
        path: "/dashboard/edit-donation/:id",
        element: (
          <PrivetRoute>
            <EditDonationCampaign />
          </PrivetRoute>
        ),
      },
      {
        path: "/dashboard/all-users",
        element: (
          <AdminRoutes>
            <AllUsersPage />
          </AdminRoutes>
        ),
      },
      {
        path: "/dashboard/manage-pets",
        element: (
          <AdminRoutes>
            <ManagePet />
          </AdminRoutes>
        ),
      },
    ],
  },
]);
