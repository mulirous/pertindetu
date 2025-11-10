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
import { MyOrdersPage } from "./pages/MyOrdersPage";
import { ProviderOrdersPage } from "./pages/ProviderOrdersPage";
import { ServicesPage } from "./pages/ServicesPage";
import { ServiceDetailPage } from "./pages/ServiceDetailPage";
import { PublicProviderPage } from "./pages/PublicProviderPage";

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
      {
        path: "/services",
        element: <ServicesPage />,
      },
      {
        path: "/services/:id",
        element: <ServiceDetailPage />,
      },
      {
        path: "/providers/:id",
        element: <PublicProviderPage />,
      },
      {
        path: "/my-orders",
        element: <MyOrdersPage />,
      },
      {
        path: "/provider/orders",
        element: <ProviderOrdersPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
