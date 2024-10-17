import React, { useRef } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import Product from "./pages/product/Product";
import Order from "./pages/order/Order";
import Vendor from "./pages/vendor/Vendor";
import ProtectedRoute from "./routes/ProtectedRoute";
import NotAuthorized from "./pages/NotAuthorized";
import Profile from "./pages/profile/Profile";
import Customer from "./pages/customer/Customer";
import Category from "./pages/category/Category";
import "./custom.scss";

const App = () => {
  const isFirebaseInitialized = useRef(false);

  return (
    <Router>
      <Routes>
        {/* Login route */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/product" element={<Product />} />
          <Route path="/order" element={<Order />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/customer" element={<Customer />} />
        </Route>

        {/* Protected route for Admin only */}
        <Route element={<ProtectedRoute requiredRole="Admin" />}>
          {/* <Route path="/inventory" element={<Inventory />} /> */}
          <Route path="/category" element={<Category />} />
          <Route path="/vendor" element={<Vendor />} />
        </Route>

        {/* Default route to redirect to login */}
        <Route path="/" element={<Login />} />

        {/* Not Authorized route */}
        <Route path="/not-authorized" element={<NotAuthorized />} />
      </Routes>
    </Router>
  );
};

// Using createRoot instead of ReactDOM.render
const rootElement = document.getElementById("root");
const root = createRoot(rootElement);
root.render(<App />);
