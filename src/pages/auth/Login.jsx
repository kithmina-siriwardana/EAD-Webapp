import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button, Col, Row } from "react-bootstrap";
import { AUTH_URLS } from "../../utils/config";
import axios from "axios";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const auth = JSON.parse(localStorage.getItem("auth"));

  useEffect(() => {
    // Check if the user is already authenticated
    if (auth && auth.token) {
      // Redirect to dashboard if authenticated
      navigate("/dashboard");
    }
  }, [auth, navigate]);

  // Bottom links
  const BottomLinks = () => {
    return (
      <Row>
        <Col xs={12} className="text-center">
          <p className="text-dark-emphasis">
            Don't have an account?{" "}
            <Link
              to="/auth/register"
              className="text-dark fw-bold ms-1 link-offset-3 text-decoration-underline"
            >
              <b>Sign up</b>
            </Link>
          </p>
        </Col>
      </Row>
    );
  };

  // Handle login function
  const handleLogin = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    if (email && password) {
      await axios
        .post(AUTH_URLS.LOGIN_URL, {
          email,
          password,
        })
        .then((response) => {
          console.log(response.data);
          localStorage.setItem("auth", JSON.stringify(response.data));
          navigate("/dashboard");
        })
        .catch((error) => {
          console.error(error);
          alert("Something went wrong! Please try again later.");
        });
    }
    setIsLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2 className="login-title">Login</h2>
        <div className="form-group">
          <label htmlFor="username">Email</label>
          <input
            type="email"
            id="username"
            className="form-control"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            className="form-control"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button
          className="login-btn"
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <span
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
          ) : (
            "Login"
          )}
        </Button>
        <BottomLinks />
      </div>
    </div>
  );
};

export default Login;
