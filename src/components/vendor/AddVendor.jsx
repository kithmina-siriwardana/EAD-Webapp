import React, { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import axios from "axios";
import { AUTH_URLS } from "../../utils/config";
import toast, { Toaster } from "react-hot-toast";

const AddVendorModal = ({
  show,
  onClose,
  initialData,
  onSuccess,
  editVendorId,
}) => {
  const [initialVendorData, setInitialVendorData] = useState(initialData);
  const [showConfirm, setShowConfirm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newVendorData, setNewVendorData] = useState({});
  const [newUpdateVendorData, setNewUpdateVendorData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Validation states
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");

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
      setNameError("Vendor Name cannot be empty.");
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

    setNewVendorData({
      fullName: name,
      email: email,
      password: password,
      role: "Vendor",
    });
    setNewUpdateVendorData({
      fullName: name,
      email: email,
      password: password,
    });
    setShowConfirm(true);
  };

  // Call API to add new vendor
  const addVendorOnConfirm = async () => {
    setIsLoading(true);
    if (initialData && editVendorId) {
      console.log("Editing Vendor", newUpdateVendorData);
      await axios
        .put(
          `${AUTH_URLS.VENDOR_UPDATE_URL}/${editVendorId}`,
          newUpdateVendorData
        )
        .then((response) => {
          console.log(response.data);
          toast.success("Vendor updated successfully");
          setIsLoading(false);
          setShowConfirm(false);
          onSuccess();
        })
        .catch((error) => {
          console.log(error);
          toast.error("Vendor update not succesful");
          setIsLoading(false);
        });
      setIsLoading(false);
    } else {
      await axios
        .post(AUTH_URLS.REGISTER_URL, newVendorData)
        .then((response) => {
          console.log(response.data);
          setIsLoading(false);
          setShowConfirm(false);
          onSuccess();
          toast.success("Vendor created successfully");
        })
        .catch((error) => {
          console.log(error);
          toast.error("Vendor create failed");
          setIsLoading(false);
        });
    }
  };

  return (
    <>
      <Modal show={show} onHide={onClose}>
        <Modal.Header closeButton style={{ backgroundColor: "#edf2fd" }}>
          {showConfirm ? (
            <Modal.Title>Confirm New Vendor</Modal.Title>
          ) : (
            <Modal.Title>
              {initialData?.userId ? "Edit Vendor" : "Add New Vendor"}
            </Modal.Title>
          )}
        </Modal.Header>
        {/* Modal Body */}
        <Modal.Body style={{ backgroundColor: "#f7f8ff" }}>
          {showConfirm ? (
            <>Are you sure you want to add this vendor?</>
          ) : (
            <>
              <Form onSubmit={handleSubmit}>
                {/* Editable Vendor ID for Adding New Vendor */}
                {initialData && editVendorId && (
                  <Form.Group className="mt-2">
                    <Form.Label>Vendor ID</Form.Label>
                    <Form.Control
                      disabled
                      type="text"
                      name="userId"
                      value={initialData && editVendorId ? editVendorId : ""}
                    />
                  </Form.Group>
                )}

                <Form.Group className="mt-2">
                  <Form.Label>Vendor Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="fullName"
                    defaultValue={
                      initialData && editVendorId ? initialData.fullName : ""
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
                      initialData && editVendorId ? initialData.email : ""
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
                onClick={addVendorOnConfirm}
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
              {initialData?.userId ? "Update Vendor" : "Add Vendor"}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
      <Toaster />
    </>
  );
};

export default AddVendorModal;
