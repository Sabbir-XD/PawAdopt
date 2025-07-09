import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import { router } from "./router/router";
import AuthProvider from "./context/Authintication/AuthProvider";
import { CardSkeleton } from "./components/Loading/Loading";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Suspense fallback={<CardSkeleton count={3} />}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </Suspense>
  </StrictMode>
);
