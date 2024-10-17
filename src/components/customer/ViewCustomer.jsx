import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { AUTH_URLS } from "../../utils/config";
import axios from "axios";

const ViewCustomerModal = ({ show, onClose, customer }) => {
  const [showModal, setShowModal] = useState(false);
  const [showCustomerView, setShowCustomerView] = useState(false);
  const [customerStatus, setCustomerStatus] = useState("");

  //initialize customer status
  useEffect(() => {
    if (customer) {
      setCustomerStatus(customer.isApproved ? "Approved" : "Pending");
    }
  }, [customer]);

  //approve customer
  const handleConfirmationModel = async () => {
    await axios.put(`${AUTH_URLS.REGISTER_URL}/${customer.userId}`);
    setShowModal(!showModal);
  };

  return (
    <Modal
      show={show}
      onHide={() => {
        setShowModal(false);
        onClose();
      }}
      size="md"
      scrollable
    >
      <Modal.Header closeButton style={{ backgroundColor: "#edf2fd" }}>
        {showModal ? (
          <Modal.Title>Approve Customer</Modal.Title>
        ) : (
          <Modal.Title>Customer Details - {customer.fullName}</Modal.Title>
        )}
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: "#f7f8ff" }}>
        {showModal ? (
          <div>
            <span>Are you sure you want to approve this customer?</span>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "20px",
              }}
            >
              <Button
                variant="warning"
                onClick={() => {
                  setShowModal(false);
                }}
                style={{ minWidth: "80px", marginRight: "10px" }}
              >
                No
              </Button>
              <Button
                variant="success"
                onClick={handleConfirmationModel}
                style={{ minWidth: "80px" }}
              >
                Yes
              </Button>
            </div>
          </div>
        ) : (
          <>
            {showCustomerView ? (
              <></>
            ) : (
              <div>
                <p>
                  <strong>Customer ID: {customer.userId}</strong>
                </p>
                <p>
                  <strong>Full Name:</strong> ${customer.fullName}
                </p>
                <p>
                  <strong>E-mail:</strong> {customer.email}
                </p>
                <p>
                  <strong>Rating:</strong> {customer.email}
                </p>
                <p>
                  <strong>Customer Status:</strong>{" "}
                  <span
                    style={{
                      color: customerStatus !== "Pending" ? "blue" : "red",
                    }}
                  >
                    {" "}
                    {customerStatus}
                  </span>
                </p>
              </div>
            )}
          </>
        )}
      </Modal.Body>
      <Modal.Footer style={{ backgroundColor: "#edf2fd" }}>
        {!showModal && customerStatus == "Pending" && (
          <>
            {/* <span>
              <Button variant="danger" onClick={onClose}>
                Delete this Customer
              </Button>
            </span> */}
            <span>
              <Button variant="primary" onClick={handleConfirmationModel}>
                Approve Customer
              </Button>
            </span>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default ViewCustomerModal;
