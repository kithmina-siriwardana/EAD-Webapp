import React, { useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import UserProfile from "../profile/UserProfile";
const ViewCsrModal = ({ show, onClose, csrData }) => {
  return (
    <Modal show={show} onHide={onClose} size="xl" scrollable>
      <Modal.Header
        closeButton
        style={{ backgroundColor: "#edf2fd" }}
      ></Modal.Header>
      <Modal.Body style={{ backgroundColor: "#f7f8ff" }}>
        {csrData ? <UserProfile csrData={csrData} /> : <div>Loading...</div>}
      </Modal.Body>
    </Modal>
  );
};

export default ViewCsrModal;
