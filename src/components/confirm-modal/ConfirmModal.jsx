import React from "react";
import { Modal, Button } from "react-bootstrap";

const ConfirmModal = ({ show, title, body, onConfirm, onClose, isLoading }) => {
  return (
    <Modal show={show} onHide={onClose} backdrop={true}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      <Modal.Footer>
        <Button
          disabled={isLoading}
          variant={
            title.includes("Delete") || title.includes("Logout")
              ? "danger"
              : "success"
          }
          onClick={onConfirm}
        >
          {isLoading ? (
            <span
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
          ) : (
            `${
              title.includes("Delete")
                ? "Delete"
                : title.includes("Logout")
                ? "Logout"
                : "Confirm"
            }`
          )}
        </Button>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;
