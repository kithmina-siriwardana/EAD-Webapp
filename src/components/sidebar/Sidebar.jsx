import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdHome } from "react-icons/io";
import { AiFillProduct } from "react-icons/ai";
import { MdProductionQuantityLimits } from "react-icons/md";
import { MdOutlineInventory } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { FaHospitalUser } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import { IoMdMenu } from "react-icons/io";
import { Image } from "react-bootstrap";
import ConfirmModal from "../confirm-modal/ConfirmModal";

const Sidebar = ({ children }) => {
  // const [isOpen, setIsOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedTab, setSelectedTab] = useState("dashboard");
  const navigate = useNavigate();
  const [loggedUser, setLoggedUser] = useState();
  const [showConfirmLogoutModal, setShowConfirmLogoutModal] = useState(false);

  // Get the logged user from the local storage
  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    setLoggedUser(auth);
  }, []);

  const sidebarItems = [
    {
      icon: <IoMdHome />,
      redirect: "/dashboard",
      label: "Dashboard",
      tab: "dashboard",
    },
    {
      icon: <AiFillProduct />,
      redirect: "/product",
      label: "Product Management",
      tab: "product",
    },
    {
      icon: <MdProductionQuantityLimits />,
      redirect: "/order",
      label: "Order Management",
      tab: "order",
    },
  ];

  // Conditionally include the "Inventory Management" tab for admins
  if (loggedUser && loggedUser.role === "Admin") {
    sidebarItems.push({
      icon: <MdOutlineInventory />,
      redirect: "/category",
      label: "Category Management",
      tab: "category",
    });

    sidebarItems.push({
      icon: <FaHospitalUser />,
      redirect: "/vendor",
      label: "Vendor Management",
      tab: "vendor",
    });
  }

  // Conditionally include the "Customer Management" tab for admins and CSR
  if (
    loggedUser &&
    (loggedUser.role === "Admin" || loggedUser.role === "CSR")
  ) {
    sidebarItems.push({
      icon: <FaUser />,
      redirect: "/customer",
      label: "Customer Management",
      tab: "customer",
    });
  }

  // Toggle the sidebar to expand and collapse
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  //Select the tab from the sidebar
  const selectTab = (e, tab, redirect) => {
    e.preventDefault();
    setSelectedTab(tab);
    navigate(redirect);
  };

  // Handle logout function
  const logout = () => {
    localStorage.removeItem("auth");
    navigate("/login");
  };

  //handle confirm logout modal
  const handleConfirmLogoutModal = () => {
    setShowConfirmLogoutModal(true);
  };

  return (
    <div className="row d-flex h-100 w-100">
      <div
        className={`${
          isCollapsed ? "col-auto" : "w-20px "
        }  h-100 position-fixed px-4`}
        style={{ backgroundColor: "#0e2249" }}
      >
        <div className="d-flex flex-column align-items-center align-items-sm-center px-0 pt-2  min-vh-100">
          {isCollapsed ? (
            <>
              {" "}
              <div className="d-flex flex-column">
                {/* <img
                  src="/assets/logo/Logo.png"
                  alt="logo"
                  className="d-block mx-auto mt-4"
                /> */}
                <button className="collaps-button " onClick={toggleSidebar}>
                  <IoMdMenu />
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="d-flex flex-raw">
                <img
                  src="/assets/logo/Logo.png"
                  alt="logo"
                  className="d-block mx-auto my-4"
                  style={{ width: "200px" }}
                />
                <button className="expand-button" onClick={toggleSidebar}>
                  <IoMdMenu />
                </button>
              </div>
            </>
          )}

          <ul
            className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-center mt-3 w-100"
            id="menu"
          >
            {sidebarItems.map((item, index) => (
              <li
                key={index}
                className={`nav-item mt-3 px-2 ${
                  !isCollapsed && "w-100"
                }  rounded-sm ${selectedTab === item.tab ? "bg-light" : ""}`}
              >
                <a
                  href={item.redirect}
                  className="nav-link align-middle px-0"
                  onClick={(e) => selectTab(e, item.tab, item.redirect)}
                >
                  <span
                    className={`ms-1 d-none d-sm-inline fs-6  ${
                      selectedTab === item.tab ? "text-secondary" : "text-light"
                    }`}
                    style={{ fontSize: "0.9rem" }}
                  >
                    {item.icon}
                  </span>{" "}
                  {!isCollapsed && (
                    <span
                      className={`ms-3 d-none d-sm-inline ${
                        selectedTab === item.tab
                          ? "text-secondary"
                          : "text-light"
                      }`}
                      style={{ fontSize: "0.9rem" }}
                    >
                      {item.label}
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>
          <hr />
          <div className="p-4 w-100">
            <div
              href="#"
              className="d-flex  align-items-center text-white text-decoration-none"
              id="dropdownUser1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {!isCollapsed && (
                <a
                  href="/profile"
                  style={{
                    textDecoration: "none",
                    color: "white",
                    display: "flex",
                    flexDirection: "row",
                    marginRight: "40px",
                  }}
                >
                  <FaUserCircle size={45} />

                  <div className="d-flex-row mx-4">
                    <b className="d-none d-sm-inline ms-1">
                      {loggedUser && loggedUser.name}
                    </b>
                    {/* <p>kithminasiriwardana@gmail.com</p> */}
                  </div>
                </a>
              )}

              <Image
                src="/assets/icons/logout.svg"
                alt="logout"
                width="20"
                height="20"
                onClick={handleConfirmLogoutModal}
              />
              {/* {!isCollapsed && (
                <span className="d-none d-sm-inline mx-3" onClick={logout}>
                  Logout
                </span>
              )} */}
            </div>
          </div>
        </div>
      </div>
      <div
        className={`${
          isCollapsed
            ? " min-h-100vh min-w-100 pl-collaps-sidebar  ml-sidebar"
            : "pl-sidebar ml-sidebar min-h-100vh min-w-100 "
        }   overflow-auto py-3`}
        style={{ backgroundColor: "#f7f8ff" }}
      >
        {children}
      </div>

      {/* Confirmation of delete Order */}
      <ConfirmModal
        show={showConfirmLogoutModal}
        title="Confirm Logout"
        body="Are you sure you want to logout from this account?"
        onConfirm={() => {
          logout();
          setShowConfirmLogoutModal(false);
        }}
        onClose={() => {
          console.log("logout cancelled");
          setShowConfirmLogoutModal(false);
        }}
      />
    </div>
  );
};

export default Sidebar;
