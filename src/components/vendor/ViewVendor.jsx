import React, { useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import UserProfile from "../../components/profile/UserProfile";
const ViewVendorModal = ({ show, onClose, vendorData }) => {
  return (
    <Modal show={show} onHide={onClose} size="xl" scrollable>
      <Modal.Header
        closeButton
        style={{ backgroundColor: "#edf2fd" }}
      ></Modal.Header>
      <Modal.Body style={{ backgroundColor: "#f7f8ff" }}>
        {vendorData ? (
          <UserProfile vendorData={vendorData} />
        ) : (
          <div>Loading...</div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ViewVendorModal;
