import React from "react";
import Sidebar from "./components/sidebar/Sidebar.jsx";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="d-flex flex-row bg-light min-vh-100 w-100 h-12">
      <Sidebar>
        <div>
          <Outlet />
        </div>
      </Sidebar>
    </div>
  );
};

export default Layout;
