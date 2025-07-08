import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import { router } from "./router/router";
import AuthProvider from "./context/Authintication/AuthProvider";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Suspense fallback={<div>Loading...</div>}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </Suspense>
  </StrictMode>
);
