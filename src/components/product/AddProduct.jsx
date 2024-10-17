import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import Select from "react-select";
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
  const [productData, setProductData] = useState(initialData);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [categoryList, setCategoryList] = useState([{}]);

  //initialize data
  useEffect(() => {
    const localData = localStorage.getItem("auth");
    const data = JSON.parse(localData);
    handleChange({
      target: {
        name: "vendor",
        value: data?.userId || "",
      },
    });
  }, []);

  //inititalize all data
  useEffect(() => {
    setSelectedImages(initialData?.imageUrls || []);
  }, [initialData]);

  //fetch category list
  useEffect(() => {
    const fetchCategoryList = async () => {
      try {
        const response = await fetch(CATEGORY_URLS.CATEGORY_GET_ALL_URL);
        const data = await response.json();
        console.log("categoryList: ", data);
        let catList = [];
        for (let i = 0; i < data.length; i++) {
          catList.push({
            value: data[i].categoryId,
            label: data[i].name,
          });
        }
        setCategoryList(catList);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategoryList();
  }, []);

  // Handle modal close
  const handleModalClose = () => {
    setShowConfirm(true);
  };

  // Handle confirm modal close
  const handleConfirmClose = () => {
    setProductData({});
    setSelectedImages([]);
    setShowConfirm(false);
    onClose();
  };

  // Handle cancel modal close
  const handleCancelClose = () => {
    setShowConfirm(false);
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + selectedImages.length > 5) {
      alert("You can upload up to 5 images.");
      return;
    }
    const newImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setSelectedImages((prevImages) => [...prevImages, ...newImages]);
  };

  // Handle image remove
  const handleRemoveImage = (index) => {
    const newImages = [...selectedImages];
    newImages.splice(index, 1);
    setSelectedImages(newImages);
  };

  // Handle image replace
  const handleReplaceImage = (index, e) => {
    const file = e.target.files[0];
    const newImages = [...selectedImages];
    newImages[index] = { file, url: URL.createObjectURL(file) };
    setSelectedImages(newImages);
  };

  // Handle category select
  // const handleCategoryChange = (selectedOption) => {
  //   console.log("Category selected: ", selectedOption);
  //   handleChange({
  //     target: { name: "category", value: selectedOption?.value || "" },
  //   });
  // };

  const handleCategoryChange = (selectedOption) => {
    console.log("Category selected: ", selectedOption);
    handleChange({
      target: { name: "category", value: selectedOption?.value || "" },
    });
  };

  useEffect(() => {
    setProductData(initialData);
  }, [initialData]);

  // useEffect(() => {
  //   if (initialData && categoryList.length > 0) {
  //     const selectedCategory = categoryList.find(
  //       (option) => option.value === initialData?.category // Match the category by value (ID)
  //     );
  //     setProductData({
  //       ...initialData,
  //       category: selectedCategory || {
  //         value: initialData?.category,
  //         label: "Unknown Category",
  //       }, // If no match, set a fallback
  //     });
  //   }
  // }, [initialData, categoryList]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleSubmit = (e) => {
    console.log("SSSSSS: ", productData);
    console.log("selectedImages: ", selectedImages);
    e.preventDefault();
    onAddProduct(productData, selectedImages);
  };

  return (
    <>
      <Modal show={show} onHide={handleModalClose} size="xl" scrollable>
        <Modal.Header closeButton style={{ backgroundColor: "#edf2fd" }}>
          {showModal ? (
            <Modal.Title>Confirm Save Changes</Modal.Title>
          ) : initialData?.id ? (
            "Edit Product"
          ) : (
            "Add New Product"
          )}
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: "#f7f8ff" }}>
          <Form onSubmit={handleSubmit}>
            <Row>
              {/* Left Half - Product Details */}
              <Col md={6}>
                {editModal === true && (
                  <Form.Group controlId="productId">
                    <Form.Label>Product ID</Form.Label>
                    <Form.Control
                      type="text"
                      name="id"
                      value={productData?.productId || ""}
                      onChange={handleChange}
                      disabled
                    />
                  </Form.Group>
                )}

                <Form.Group controlId="productName" className="mt-2">
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={productData?.name || ""}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="category" className="mt-2">
                  <Form.Label>Category</Form.Label>
                  <Select
                    options={categoryList}
                    value={
                      categoryList.find(
                        (option) => option.value === productData?.category // Compare by `value`
                      ) || null
                    }
                    onChange={handleCategoryChange}
                    isSearchable={true}
                    placeholder="Select a category"
                  />
                </Form.Group>

                {/* <Form.Group controlId="category" className="mt-2">
                  <Form.Label>Category</Form.Label>
                  <Select
                    options={categoryList}
                    value={
                      categoryList.find(
                        (option) =>
                          option.value === productData?.category?.value // Make sure it compares by `value`
                      ) || null
                    }
                    onChange={handleCategoryChange}
                    isSearchable={true}
                    placeholder="Select a category"
                  />
                </Form.Group> */}

                <Form.Group controlId="price" className="mt-2">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={productData?.price || ""}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="description" className="mt-2">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="description"
                    value={productData?.description || ""}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="status" className="mt-2">
                  <Form.Label>Status</Form.Label>
                  <Form.Check
                    type="switch"
                    id="status"
                    name="status"
                    label={productData?.status ? "Active" : "Inactive"}
                    checked={productData?.status || false}
                    onChange={(e) =>
                      handleChange({
                        target: {
                          name: "status",
                          value: e.target.checked,
                        },
                      })
                    }
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="images" className="mt-2">
                  <Form.Label>Images (Max 5)</Form.Label>
                  <Form.Control
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={selectedImages && selectedImages.length >= 5}
                  />
                  <div className="mt-3">
                    {selectedImages.map((image, index) => (
                      <div key={index} className="mb-2">
                        <img
                          src={initialData?.id ? image : image.url}
                          alt={`Uploaded preview ${index + 1}`}
                          style={{
                            width: "200px",
                            height: "150px",
                            objectFit: "cover",
                            marginRight: "10px",
                          }}
                        />
                        <Button
                          variant="danger"
                          size="sm"
                          className="me-2"
                          onClick={() => handleRemoveImage(index)}
                        >
                          Remove
                        </Button>
                        <Form.Control
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleReplaceImage(index, e)}
                          style={{ display: "inline-block", width: "200px" }}
                        />
                      </div>
                    ))}
                  </div>
                </Form.Group>
              </Col>
            </Row>

            <Button variant="primary" type="submit" className="mt-4">
              {initialData?.id ? "Update" : "Add Product"}
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
          <Button variant="danger" onClick={handleConfirmClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddProductModal;
