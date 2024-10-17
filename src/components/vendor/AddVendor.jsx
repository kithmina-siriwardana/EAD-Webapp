import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import { AUTH_URLS } from "../../utils/config";

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
  const [isLoading, setIsLoading] = useState(false);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setNewVendorData({
      fullName: name,
      email: email,
      password: password,
      role: "Vendor",
    });
    setShowConfirm(true);
  };

  // Call API to add new vendor
  const addVendorOnConfirm = async () => {
    setIsLoading(true);

    if (initialData && editVendorId) {
      console.log("Editing Vendor");
      setIsLoading(false);
    } else {
      await axios
        .post(AUTH_URLS.REGISTER_URL, newVendorData)
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
              </Form.Group>

              <Form.Group className="mt-2">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mt-2">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
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
  );
};

export default AddVendorModal;
