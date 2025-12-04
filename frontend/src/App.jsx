import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProductList from "./pages/ProductList";
import ProductCreate from "./pages/ProductCreate";
import ReviewList from "./pages/ReviewList";
import LoginLog from "./pages/LoginLog";
import UserPage from "./pages/UserPage";

import AppLayout from "./components/Layout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
        <Route path="/products" element={<AppLayout><ProductList /></AppLayout>} />
        <Route path="/products/create" element={<AppLayout><ProductCreate /></AppLayout>} />
        <Route path="/reviews" element={<AppLayout><ReviewList /></AppLayout>} />
        <Route path="/login-logs" element={<AppLayout><LoginLog /></AppLayout>} />
        <Route path="/users" element={<AppLayout><UserPage /></AppLayout>} />
      </Routes>
    </BrowserRouter>
  );
}
