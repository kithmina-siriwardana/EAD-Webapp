import React, { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import axios from "axios";
import { AUTH_URLS } from "../../utils/config";
import toast, { Toaster } from "react-hot-toast";

const AddCsrModal = ({ show, onClose, initialData, onSuccess, editCsrId }) => {
  const [initialCsrData, setInitialCsrData] = useState(initialData);
  const [showConfirm, setShowConfirm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newCsrData, setNewCsrData] = useState({});
  const [newUpdateCsrData, setNewUpdateCsrData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Validation states
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // Validate password
  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (
      !minLength ||
      !hasUpperCase ||
      !hasLowerCase ||
      !hasNumber ||
      !hasSpecialChar
    ) {
      setPasswordError(
        "Password must be at least 8 characters long, contain a capital letter, a lowercase letter, a number, and a special character."
      );
    } else {
      setPasswordError(""); // Clear error if validation passes
    }
  };

  // Validate confirm password
  const validateConfirmPassword = (confirmPassword) => {
    if (confirmPassword !== password) {
      setConfirmPasswordError("Passwords do not match.");
    } else {
      setConfirmPasswordError(""); // Clear error if passwords match
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setNameError(""); // Reset name error
    setEmailError(""); // Reset email error
    setPasswordError(""); // Reset password error
    setConfirmPasswordError(""); // Reset confirm password error

    // Validate Vendor Name and Email
    if (!name.trim()) {
      setNameError("Name cannot be empty.");
      return;
    }

    if (!email.trim()) {
      setEmailError("Email cannot be empty.");
      return;
    }

    if (!password.trim()) {
      setPasswordError("Password cannot be empty.");
      return;
    }

    if (!confirmPassword.trim()) {
      setConfirmPasswordError("Confirm Password cannot be empty.");
      return;
    }

    // Validate password structure
    validatePassword(password);
    if (passwordError) return;

    // Validate confirm password
    validateConfirmPassword(confirmPassword);
    if (confirmPasswordError) return;

    setNewCsrData({
      fullName: name,
      email: email,
      password: password,
      role: "CSR",
    });
    setNewUpdateCsrData({
      fullName: name,
      email: email,
      password: password,
    });
    setShowConfirm(true);
  };

  // Call API to add new CSR
  const addCsrOnConfirm = async () => {
    setIsLoading(true);
    if (initialData && editCsrId) {
      console.log("Editing CSR", newUpdateCsrData);
      await axios
        .put(`${AUTH_URLS.VENDOR_UPDATE_URL}/${editCsrId}`, newUpdateCsrData)
        .then((response) => {
          console.log(response.data);
          toast.success("CSR updated successfully");
          setIsLoading(false);
          setShowConfirm(false);
          onSuccess();
        })
        .catch((error) => {
          console.log(error);
          setIsLoading(false);
        });
      setIsLoading(false);
    } else {
      await axios
        .post(AUTH_URLS.REGISTER_URL, newCsrData)
        .then((response) => {
          console.log(response.data);
          setIsLoading(false);
          setShowConfirm(false);
          onSuccess();
        })
        .catch((error) => {
          console.log(error);
          setIsLoading(false);
        });
    }
  };

  return (
    <>
      {" "}
      <Toaster />
      <Modal show={show} onHide={onClose}>
        <Modal.Header closeButton style={{ backgroundColor: "#edf2fd" }}>
          {showConfirm ? (
            <Modal.Title>Confirm New CSR</Modal.Title>
          ) : (
            <Modal.Title>
              {initialData?.userId ? "Edit CSR" : "Add New CSR"}
            </Modal.Title>
          )}
        </Modal.Header>
        {/* Modal Body */}
        <Modal.Body style={{ backgroundColor: "#f7f8ff" }}>
          {showConfirm ? (
            <>Are you sure you want to add this CSR?</>
          ) : (
            <>
              <Form onSubmit={handleSubmit}>
                {/* Editable CSR ID for Adding New CSR */}
                {initialData && editCsrId && (
                  <Form.Group className="mt-2">
                    <Form.Label>CSR ID</Form.Label>
                    <Form.Control
                      disabled
                      type="text"
                      name="userId"
                      value={initialData && editCsrId ? editCsrId : ""}
                    />
                  </Form.Group>
                )}

                <Form.Group className="mt-2">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="fullName"
                    defaultValue={
                      initialData && editCsrId ? initialData.fullName : ""
                    }
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  {nameError && (
                    <Alert variant="danger" className="mt-2">
                      {nameError}
                    </Alert>
                  )}{" "}
                  {/* Show name error */}
                </Form.Group>

                <Form.Group className="mt-2">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="text"
                    name="email"
                    defaultValue={
                      initialData && editCsrId ? initialData.email : ""
                    }
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  {emailError && (
                    <Alert variant="danger" className="mt-2">
                      {emailError}
                    </Alert>
                  )}{" "}
                  {/* Show email error */}
                </Form.Group>

                <Form.Group className="mt-2">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    onChange={(e) => {
                      setPassword(e.target.value);
                      validatePassword(e.target.value); // Validate password on change
                    }}
                    required
                  />
                  {passwordError && (
                    <Alert variant="danger" className="mt-2">
                      {passwordError}
                    </Alert>
                  )}{" "}
                  {/* Show password error */}
                </Form.Group>

                <Form.Group className="mt-2">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      validateConfirmPassword(e.target.value); // Validate confirm password on change
                    }}
                    required
                  />
                  {confirmPasswordError && (
                    <Alert variant="danger" className="mt-2">
                      {confirmPasswordError}
                    </Alert>
                  )}{" "}
                  {/* Show confirm password error */}
                </Form.Group>
              </Form>
            </>
          )}
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: "#edf2fd" }}>
          {showConfirm ? (
            <>
              <Button
                variant="warning"
                onClick={() => setShowConfirm(false)}
                style={{ minWidth: "80px" }}
              >
                No
              </Button>
              <Button
                disabled={isLoading}
                variant={"success"}
                onClick={addCsrOnConfirm}
                style={{ minWidth: "80px" }}
              >
                Yes
              </Button>
            </>
          ) : (
            <Button
              variant="primary"
              type="submit"
              className="mt-4"
              onClick={handleSubmit}
            >
              {initialData?.userId ? "Update CSR" : "Add CSR"}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddCsrModal;
