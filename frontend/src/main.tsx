import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import DashboardPage from './pages/DashboardPage';
import Homepage from './pages/Homepage';
import ProfilePage from './pages/Profilepage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage />,
  },
  {
    path: "/profile/:id", 
    element: <ProfilePage />,
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)