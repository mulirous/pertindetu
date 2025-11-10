import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import RootLayout from "./components/RootLayout";

import DashboardPage from "./pages/DashboardPage";
import Homepage from "./pages/Homepage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import ProviderCreatePage from "./pages/ProviderCreatePage";
import RegisterPage from "./pages/RegisterPage";
import { ServiceCreatePage } from "./pages/ServiceCreatePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Homepage />,
      },
      {
        path: "/profile",
        element: <ProfilePage />,
      },
      {
        path: "/dashboard",
        element: <DashboardPage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
      {
        path: "/providers/new",
        element: <ProviderCreatePage />,
      },
      {
        path: "/services/new",
        element: <ServiceCreatePage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
