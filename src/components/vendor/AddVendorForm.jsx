import React, { useEffect } from "react";
import { Button, Form } from "react-bootstrap";

const AddVendorForm = (initialData) => {
  const [vendorData, setVendorData] = React.useState(initialData);

  useEffect(() => {
    setVendorData(initialData);
  }, [initialData]);

  // // Handle data change
  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setVendorData({ ...vendorData, [name]: value });
  // };

  // Handle data change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setVendorData({ ...vendorData, [name]: value });

    // Validate password and confirm password
    if (name === "password") {
      validatePassword(value);
    } else if (name === "confirmPassword") {
      validateConfirmPassword(value, vendorData.password);
    }
  };

  // Handle form submission
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
      setError(
        "Password must be at least 8 characters long, contain a capital letter, a lowercase letter, a number, and a special character."
      );
    } else {
      setError("");
    }
  };

  const validateConfirmPassword = (confirmPassword, password) => {
    if (confirmPassword !== password) {
      setError("Passwords do not match.");
    } else {
      setError("");
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onAddVendor(vendorData);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="vendorName" className="mt-2">
        <Form.Label>Vendor Name</Form.Label>
        <Form.Control
          type="text"
          name="name"
          defaultValue={vendorData?.name || ""}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="vendor" className="mt-2">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="text"
          name="email"
          defaultValue={vendorData?.email || ""}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="password" className="mt-2">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          name="password"
          onChange={handleChange}
          required
        />
        {error && (
          <Alert variant="danger" className="mt-2">
            {error}
          </Alert>
        )}
      </Form.Group>

      <Form.Group controlId="price" className="mt-2">
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control
          type="password"
          name="confirmPassword"
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Button variant="primary" type="submit" className="mt-4">
        {initialData?.id ? "Update" : "Add Vendor"}
      </Button>
    </Form>
  );
};

export default AddVendorForm;
