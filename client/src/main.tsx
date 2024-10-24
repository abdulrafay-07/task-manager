import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";

import { store } from "@/store/store";

import Home from "@/pages/home.tsx";
import LoginPage from "@/pages/auth/login";
import SignUpPage from "@/pages/auth/sign-up";
import MyTasks from "@/pages/my-tasks";
import AuthLayout from "@/components/auth/auth-layout";
import App from "@/App.tsx";

import "@/index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: (
          <AuthLayout authentication>
            <Home />
          </AuthLayout>
        )
      },
      {
        path: "/login",
        element: (
          <AuthLayout authentication={false}>
            <LoginPage />
          </AuthLayout>
        )
      },
      {
        path: "/sign-up",
        element: (
          <AuthLayout authentication={false}>
            <SignUpPage />
          </AuthLayout>
        )
      },
      {
        path: "/my-tasks",
        element: (
          <AuthLayout authentication={true}>
            <MyTasks />
          </AuthLayout>
        )
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <Toaster />
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);