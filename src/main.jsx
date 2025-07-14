import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import { router } from "./router/router";
import AuthProvider from "./context/Authintication/AuthProvider";
import { CardSkeleton } from "./components/Loading/Loading";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import StripeProvider from "./context/StripeProvider/StripeProvider";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Suspense fallback={<CardSkeleton count={3} />}>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <StripeProvider>
            <RouterProvider router={router} />
          </StripeProvider>
        </QueryClientProvider>
      </AuthProvider>
    </Suspense>
  </StrictMode>
);
