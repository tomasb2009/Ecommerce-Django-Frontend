import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";

const PrivateRoute = ({ children }) => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const loggedIn = typeof isLoggedIn === "function" ? isLoggedIn() : false;

  return loggedIn ? <>{children}</> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
