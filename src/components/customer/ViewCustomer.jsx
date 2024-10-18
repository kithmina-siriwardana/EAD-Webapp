import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { AUTH_URLS } from "../../utils/config";
import axios from "axios";

const ViewCustomerModal = ({
  show,
  onClose,
  customer,
  isCustomerUpdated,
  setIsCustomerUpdated,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [showCustomerView, setShowCustomerView] = useState(false);
  const [customerStatus, setCustomerStatus] = useState("");

  //initialize customer status
  useEffect(() => {
    if (customer) {
      setCustomerStatus(customer.isApproved ? "Approved" : "Pending");
    }
  }, [customer, isCustomerUpdated]);

  const handleConfirmationModel = async () => {
    setShowModal(!showModal);
  };

  const handleApproveCustomer = async () => {
    const response = await axios.put(
      `${AUTH_URLS.APPROVE_CUSTOMER}/${customer.userId}`
    );
    setIsCustomerUpdated(!isCustomerUpdated);
    onClose();
    console.log(response.message);
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
          <Modal.Title>
            Customer Details - {customer?.fullName && customer.fullName}
          </Modal.Title>
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
                onClick={handleApproveCustomer}
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
                  <strong>
                    Customer ID: {customer?.userId && customer.userId}
                  </strong>
                </p>
                <p>
                  <strong>Full Name:</strong> $
                  {customer?.fullName && customer.fullName}
                </p>
                <p>
                  <strong>E-mail:</strong> {customer?.email && customer.email}
                </p>
                {/* <p>
                  <strong>Rating:</strong> {customer.email}
                </p> */}
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
