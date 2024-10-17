import axios from "axios";
import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { CATEGORY_URLS } from "../../utils/config";
const AddProductModal = ({
  show,
  onClose,
  onAddProduct,
  initialData,
  editModal,
  selectedImages,
  setSelectedImages,
}) => {
  const [categoryData, setCategoryData] = useState(initialData);
  const [showConfirm, setShowConfirm] = useState(false);

  //handle modal close
  const handleModalClose = () => {
    setShowConfirm(true);
  };

  const handleCancelClose = () => {
    setShowConfirm(false);
  };

  //handle confirm model close
  const handleConfirmClose = () => {
    setCategoryData({});
    setSelectedImages([]);
    setShowConfirm(false);
    onClose();
  };

  //inititalize all data
  useEffect(() => {
    setCategoryData(initialData);
  }, [initialData]);

  //habdle data changing
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategoryData({ ...categoryData, [name]: value });
  };

  //handle category submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (initialData?.id) {
      await axios
        .post(CATEGORY_URLS.CATEGORY_CREATE_URL, categoryData)
        .then((response) => {
          alert("Category added successfully!");
          onClose();
        })
        .catch((error) => {
          console.error(error);
          alert("Something went wrong! Please try again later.");
        });
    } else {
      await axios
        .put(
          `${CATEGORY_URLS.CATEGORY_UPDATE_URL}/${categoryData.categoryId}`,
          categoryData
        )
        .then((response) => {
          alert("Category updated successfully!");
          onClose();
        })
        .catch((error) => {
          console.error(error);
          alert("Something went wrong! Please try again later.");
        });
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleModalClose} scrollable>
        <Modal.Header closeButton style={{ backgroundColor: "#edf2fd" }}>
          <Modal.Title>
            {initialData?.id ? "Edit Product" : "Add New Category"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: "#f7f8ff" }}>
          <Form onSubmit={handleSubmit}>
            <Row>
              {/* Left Half - Product Details */}
              <Col md={8}>
                <Form.Group controlId="productName" className="mt-2">
                  <Form.Label>Category Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={categoryData?.name || ""}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="description" className="mt-2">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="description"
                    value={categoryData?.description || ""}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              {/* Right Half - Image Upload */}
            </Row>

            <Button variant="primary" type="submit" className="mt-4 ">
              {initialData?.id ? "Update" : "Add Category"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Confirmation Modal */}
      <Modal show={showConfirm} onHide={handleCancelClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Close</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to close? Any unsaved changes will be lost.
        </Modal.Body>
        <Modal.Footer>
          {/* <Button variant="secondary" onClick={handleCancelClose}>
          Cancel
        </Button> */}
          <Button variant="danger" onClick={handleConfirmClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddProductModal;
