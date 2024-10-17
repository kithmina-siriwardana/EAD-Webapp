import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

const NotAuthorized = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/dashboard");
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>403 - Not Authorized</h1>
      <p style={styles.message}>
        You do not have permission to view this page.
      </p>
      <Button style={styles.button} onClick={handleGoBack}>
        Go to Home
      </Button>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    textAlign: "center",
    backgroundColor: "#f8f9fa",
  },
  heading: {
    fontSize: "2rem",
    marginBottom: "1rem",
  },
  message: {
    fontSize: "1rem",
    marginBottom: "2rem",
  },
  button: {
    padding: "0.5rem 1rem",
    fontSize: "1rem",
    cursor: "pointer",
  },
};

export default NotAuthorized;
