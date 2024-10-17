import React, { useState } from "react";
import { Modal, Row, Col } from "react-bootstrap";
import ProductViewContent from "./productViewContent";

const ViewProduct = ({ show, onClose, productData }) => {
  return (
    <>
      <Modal show={show} onHide={onClose} size="xl" scrollable>
        <Modal.Header closeButton style={{ backgroundColor: "#edf2fd" }}>
          <Modal.Title>Product Preview</Modal.Title>
        </Modal.Header>

        {productData ? (
          <Modal.Body
            style={{ backgroundColor: "#f7f8ff", minHeight: "550px" }}
          >
            <ProductViewContent productData={productData} />
          </Modal.Body>
        ) : (
          <div
            className="spinner-border"
            style={{ width: "3rem", height: "3rem" }}
            role="status"
          >
            <span className="sr-only">Loading...</span>
          </div>
        )}
      </Modal>
    </>
  );
};

export default ViewProduct;
