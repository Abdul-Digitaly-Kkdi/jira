import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
    const isLoggedIn = localStorage.getItem("access_token");


    if (!isLoggedIn) {
        return <Navigate to="/projects" replace />;
    }

    return children;
}
