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
import PetDetails from "@/pages/PetListing/PetDetails/PetDetails";
import DonationCampaign from "@/pages/DonationCampaign/DonationCampaign";
import DonationDetails from "@/pages/DonationCampaign/DonationDetail/DonationDetail";
import AllDonationsManage from "@/pages/Dashboard/AdminDashboard/AllDonationsManage/AllDonationsManager";
import MyDonations from "@/pages/Dashboard/MyDonations/MyDonations";
import MyAdoptionRequests from "@/pages/Dashboard/MyAdoptionRequests/MyAdoptionRequests";
import PetByCategory from "@/pages/Home/PetsCategory/PetByCategory/PetByCategory";
import Profile from "@/pages/Dashboard/Profile/Profile";

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
        path: "/pet-listing",
        element: <PetListing />,
      },
      {
        path: "/pet-listing/:id",
        element: (
          <PrivetRoute>
            <PetDetails />
          </PrivetRoute>
        ),
      },
      {
        path: "/pets/category/:name",
        element: (
          <PrivetRoute>
            <PetByCategory />
          </PrivetRoute>
        ),
      },
      {
        path: "/donation-campaigns",
        element: <DonationCampaign />,
      },
      {
        path: "/donation-campaigns/:id",
        element: (
          <PrivetRoute>
            <DonationDetails />
          </PrivetRoute>
        ),
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
        path: "/dashboard/adoption-requests",
        element: (
          <PrivetRoute>
            <MyAdoptionRequests />
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
        path: "/dashboard/my-donations-campaigns",
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
        path: "/dashboard/my-donations",
        element: (
          <PrivetRoute>
            <MyDonations />
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
      {
        path: "/dashboard/manage-donations",
        element: (
          <AdminRoutes>
            <AllDonationsManage />
          </AdminRoutes>
        ),
      },
      {
        path: "/dashboard/profile",
        element: (
          <PrivetRoute>
            <Profile />
          </PrivetRoute>
        ),
      },
    ],
  },
]);
