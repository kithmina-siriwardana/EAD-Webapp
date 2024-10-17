import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useAuth = (requiredRole) => {
  const [auth, setAuth] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check local storage for auth data
    const storedAuth = JSON.parse(localStorage.getItem("auth"));

    if (!storedAuth || !storedAuth.token) {
      // If not authenticated, redirect to login
      navigate("/login");
      setIsLoading(false);
    } else if (requiredRole && storedAuth.role !== requiredRole) {
      // If authenticated but does not have the required role, redirect to "not authorized"
      navigate("/not-authorized");
      setIsLoading(false);
    } else {
      // If authenticated and has required role, set auth data
      setAuth(storedAuth);
      setIsLoading(false);
    }
  }, [requiredRole, navigate]);

  return { auth, isLoading };
};

export default useAuth;
