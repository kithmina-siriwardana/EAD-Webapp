import React, { useEffect, useRef } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Layout from "../Layout";
import useAuth from "../hooks/useAuth"; // Import custom hook
import { generateToken, messaging } from "../notifications/firebase";
import { onMessage } from "firebase/messaging";

const ProtectedRoute = ({ requiredRole }) => {
  const isFirbaseMessageInitialized = useRef(false);
  const { auth, isLoading } = useAuth(requiredRole);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!auth) {
    return null;
  }

  // useEffect(() => {
  //   if (!isFirbaseMessageInitialized.current) {
  //     isFirbaseMessageInitialized.current = false;
  //     generateToken();
  //     onMessage(messaging, (payload) => {
  //       console.log("Message received: ", payload);
  //     });
  //   }
  // }, []);

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default ProtectedRoute;

// import React, { useEffect, useRef } from "react";
// import { Navigate, Outlet } from "react-router-dom";
// import Layout from "../Layout";
// import { generateToken, messaging } from "../notifications/firebase";
// import { onMessage } from "firebase/messaging";

// const ProtectedRoute = ({ requiredRole }) => {
//   const isFirbaseMessageInitialized = useRef(false);
//   const auth = JSON.parse(localStorage.getItem("auth"));

//   // Check if the user is authenticated
//   const isAuthenticated = auth && auth.token;

//   // Check if the user has the required role (if specified)
//   const hasRequiredRole = !requiredRole || (auth && auth.role === requiredRole);

//   useEffect(() => {
//     if (!isFirbaseMessageInitialized.current) {
//       isFirbaseMessageInitialized.current = false;
//       generateToken();
//       onMessage(messaging, (payload) => {
//         console.log("Message received: ", payload);
//       });
//     }
//   }, []);

//   if (!isAuthenticated) {
//     // Redirect to login if not authenticated
//     return <Navigate to="/login" />;
//   }

//   if (!hasRequiredRole) {
//     // Redirect to a "not authorized" page or some other appropriate action if the role is insufficient
//     return <Navigate to="/not-authorized" />;
//   }

//   // If authenticated and has the required role, render the layout with Outlet for nested routes
//   return (
//     <Layout>
//       <Outlet />
//     </Layout>
//   );
// };

// export default ProtectedRoute;
