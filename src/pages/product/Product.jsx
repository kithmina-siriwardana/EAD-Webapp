import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import ConfirmModal from "../../components/confirm-modal/ConfirmModal";
import AddProductModal from "../../components/product/AddProduct";
import ViewProduct from "../../components/product/ViewProduct";
import { PRODUCT_URLS, CATEGORY_URLS } from "../../utils/config";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const Product = () => {
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRating, setSelectedRating] = useState();
  const [selectedCategory, setSelectedCategory] = useState();
  const [selectedImages, setSelectedImages] = useState([]);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showAddConfirmModal, setShowAddConfirmModal] = useState(false);
  const [showEditConfirmModal, setShowEditConfirmModal] = useState(false);
  const [showViewProductModal, setShowViewProductModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editModal, setEditModal] = useState(false);
  const [newProductData, setNewProductData] = useState(null);
  const [editProductId, setEditProductId] = useState(null);
  const [isProductUpdated, setIsProductUpdated] = useState(false);
  const [categories, setCategories] = useState([]);

  const loggedInUser = JSON.parse(localStorage.getItem("auth"));

  // Function to handle product fetch
  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `${PRODUCT_URLS.PRODUCT_GET_BY_ROLE_URL}/${loggedInUser.userId}`
      );
      const data = await response.json();
      console.log("Products: ", data);
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };

  //Fetch all categories
  const fetchCategories = async () => {
    try {
      const response = await fetch(CATEGORY_URLS.CATEGORY_GET_ALL_URL);
      const data = await response.json();
      console.log("Categories: ", data);
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  // Fetch products on component mount
  useEffect(() => {
    if (!loggedInUser) return;

    fetchProducts();
    fetchCategories();
    setIsLoading(false);
  }, [loggedInUser && isProductUpdated]);

  // Function to handle adding a new product or editing an existing one
  const handleAddProduct = (product, images) => {
    console.log("Productdata:---s ", product);
    if (editProductId !== null) {
      // Edit mode
      product.vendor = JSON.parse(localStorage.getItem("auth")).userId;
      setNewProductData(product);
      setSelectedImages(images);
      setShowEditConfirmModal(true);
      setShowAddProductModal(false);
    } else {
      // Add mode
      product.vendor = JSON.parse(localStorage.getItem("auth")).userId;
      console.log("Adding new product", product);
      console.log("Selected images", images);
      setNewProductData(product);
      setSelectedImages(images);
      setShowAddConfirmModal(true);
      setShowAddProductModal(false);
    }
  };

  // Function to handle adding a new product
  const handleAddProductOnConfirm = async () => {
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", newProductData.name);
      formData.append("description", newProductData.description);
      formData.append("price", newProductData.price);
      formData.append("categoryID", newProductData.category);
      formData.append("vendorID", newProductData.vendor);
      formData.append("quantity", newProductData.quantity);

      // Append image files if you have any
      selectedImages.forEach((image) => {
        formData.append("images", image.file);
      });

      await axios
        .post(PRODUCT_URLS.PRODUCT_CREATE_URL, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          toast.success("Product added successfully:");
          setShowAddProductModal(false);
          setIsProductUpdated(true);
          fetchProducts();
          fetchCategories();
          setIsLoading(false);
        });
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product. Please try again.");
    }
    setIsLoading(false);
  };

  // Function to handle editing an existing product
  const handleEditProductOnConfirm = async () => {
    console.log("Updating existing product", newProductData);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("VendorId", newProductData.vendor || "");
      formData.append("Price", newProductData.price);
      formData.append("ProductId", newProductData.productId);
      formData.append("Quantity", newProductData.quantity || 0);
      formData.append("Name", newProductData.name);
      formData.append("IsDeleted", ""); // Add this if needed, or set an appropriate value
      formData.append("CategoryId", newProductData.category || "");
      formData.append("Id", ""); // Add this if needed, or set an appropriate value
      formData.append("Description", newProductData.description);

      // Append image files if you have any
      selectedImages.forEach((image) => {
        formData.append("images", image.file);
      });

      console.log("product data----------------- ", formData);

      const response = await axios.patch(
        `${PRODUCT_URLS.PRODUCT_UPDATE_URL}/${newProductData.productId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Product updated successfully:");
      setShowAddProductModal(false);
      setIsProductUpdated(true);
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product. Please try again.");
    }
    setIsLoading(false);

    setEditProductId(null); // Reset edit mode
    setShowAddProductModal(false);
  };

  // Function to handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  // Function to handle category filter change
  const handleCategoryFilterChange = (e) => {
    console.log("Selected category: ", e.target.value);
    setSelectedCategory(e.target.value);
  };

  // Function to filter products based on search query and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery) ||
      // product.vendor.toLowerCase().includes(searchQuery) ||
      product.price.toString().includes(searchQuery);

    const matchesRating = selectedCategory
      ? product.categoryName.toString() === selectedCategory.toString()
      : true;

    return matchesSearch && matchesRating;
  });

  // Function to handle edit button click
  const handleEdit = (id) => {
    setEditModal(true);
    const productToEdit = products.find((product) => product.productId === id);
    console.log("Product to edit: ", productToEdit);
    setNewProductData(productToEdit);
    setEditProductId(id);
    setShowAddProductModal(true);
  };

  // Function to handle delete button click
  const handleDelete = (id) => {
    console.log(`Delete product with ID: ${id}`);
    setEditProductId(id);
    setShowModal(true);
  };

  // Function to handle delete confirmation ///////////////////////////////////// Check this /////////////////////////////////////
  const handleDeleteConfirm = async () => {
    setIsLoading(false);
    await axios
      .delete(`${PRODUCT_URLS.PRODUCT_DELETE_URL}/${editProductId}`)
      .then(async (response) => {
        setIsProductUpdated(true);
        await fetchProducts();
        await fetchCategories();
        setIsLoading(false);
        toast.success("Product deleted successfully");
      })
      .catch((error) => {
        console.error("Error deleting product:", error);
        toast.error("Product is currently being used in an order.");
      });
    setShowModal(false);
  };

  // Function to handle add button click
  const handleAdd = () => {
    setEditModal(false);
    setNewProductData({
      id: "",
      name: "",
      vendor: "",
      price: "",
      category: "",
    });
    setSelectedImages([]);
    setEditProductId(null);
    setShowAddProductModal(true);
  };

  //handle product view
  const handleProductView = (id) => {
    const productToView = products.find((product) => product.id === id);
    setNewProductData(productToView);
    setShowViewProductModal(true);
  };

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // You can set this to any number of items per page

  // Calculate total pages based on filtered products
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Calculate the products for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Function to handle page change
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="px-4 my-4">
      <Toaster />
      {/* Header text */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>List of All Products</h1>
        {JSON.parse(localStorage.getItem("auth")).role === "Vendor" && (
          <Button variant="primary" onClick={handleAdd}>
            Add New Product
          </Button>
        )}
      </div>

      {/* Filters */}
      <div
        className="mb-4"
        style={{
          backgroundColor: "#edf2fd",
          borderRadius: "10px",
          padding: "20px",
        }}
      >
        <h4>Search Products</h4>
        <div className="d-flex justify-content-between align-items-center">
          <input
            type="text"
            className="form-control w-25"
            placeholder="Search by name, vendor, or price"
            onChange={handleSearchChange}
          />

          {/* Filter by Rating */}
          <select
            className="form-select w-25"
            value={selectedCategory}
            onChange={handleCategoryFilterChange}
          >
            <option value="">Filter by Category (All)</option>
            {categories.map((category, index) => (
              <option key={index} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div>
        {isLoading || products.length == 0 ? (
          <div
            className="spinner-border"
            style={{ width: "3rem", height: "3rem" }}
            role="status"
          ></div>
        ) : (
          <>
            {currentProducts.length == 0 ? (
              <>
                <div
                  style={{
                    width: "full",
                    display: "flex",
                    justifyContent: "center",
                    textAlign: "center",
                    height: "100vh",
                    marginTop: "25vh",
                    fontSize: "30px",
                  }}
                >
                  No records were found
                </div>
              </>
            ) : (
              <Table
                bordered
                hover
                style={{ backgroundColor: "#edf2fd" }}
                className="custom-table"
              >
                <thead>
                  <tr>
                    <th>Product ID</th>
                    <th>Product Name</th>
                    <th>Vendor </th>
                    <th>Price (Rs.)</th>
                    <th>Quantity</th>
                    <th>Category</th>
                    {/* <th>Status</th> */}
                    {loggedInUser.role === "Vendor" && <th>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {currentProducts.map((product) => (
                    <tr
                      key={product.id}
                      onClick={() => console.log(product.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <td onClick={() => handleProductView(product.id)}>
                        {product.productId}
                      </td>
                      <td onClick={() => handleProductView(product.id)}>
                        {product.name}
                      </td>
                      <td onClick={() => handleProductView(product.id)}>
                        {product.vendorName}
                      </td>
                      <td onClick={() => handleProductView(product.id)}>
                        {product.price}
                      </td>
                      <td onClick={() => handleProductView(product.id)}>
                        {product.quantity}
                      </td>
                      <td onClick={() => handleProductView(product.id)}>
                        {product.categoryName}
                      </td>
                      {loggedInUser.role === "Vendor" && (
                        <td>
                          <Button
                            variant="warning"
                            className="me-2"
                            onClick={() => handleEdit(product.productId)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => handleDelete(product.productId)}
                          >
                            Delete
                          </Button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
            {/* Pagination Controls */}
            <div
              className="pagination-controls"
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "10px",
              }}
            >
              <Button
                style={{
                  marginLeft: "10px",
                }}
                variant="primary"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              {[...Array(totalPages)].map((_, index) => (
                <Button
                  key={index}
                  variant={currentPage === index + 1 ? "primary" : "light"}
                  onClick={() => handlePageChange(index + 1)}
                  style={{
                    marginLeft: "10px",
                  }}
                >
                  {index + 1}
                </Button>
              ))}
              <Button
                style={{
                  marginLeft: "10px",
                }}
                variant="primary"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddProductModal && (
        <AddProductModal
          show={showAddProductModal}
          onClose={() => setShowAddProductModal(false)}
          onAddProduct={handleAddProduct}
          initialData={newProductData}
          editModal={editModal}
          selectedImages={selectedImages}
          setSelectedImages={setSelectedImages}
        />
      )}

      {/* View Product Modal */}
      {showViewProductModal && (
        <ViewProduct
          show={showViewProductModal}
          onClose={() => setShowViewProductModal(false)}
          onAddProduct={handleAddProduct}
          productData={newProductData}
          editModal={editModal}
          selectedImages={selectedImages}
          setSelectedImages={setSelectedImages}
        />
      )}

      {/* Confirmation of delete product */}
      <ConfirmModal
        show={showModal}
        title="Delete Product"
        body="Are you sure you want to delete this product?"
        onConfirm={() => {
          handleDeleteConfirm();
        }}
        onClose={() => {
          console.log("Delete cancelled");
          setShowModal(false);
        }}
        isLoading={isLoading}
      />

      {/* Confirmation of add new product */}
      <ConfirmModal
        show={showAddConfirmModal}
        title="Confirm New Product"
        body="Are you sure you want to add this product?"
        onConfirm={() => {
          console.log("Create confirmed");
          handleAddProductOnConfirm(newProductData);
          setShowAddConfirmModal(false);
        }}
        onClose={() => {
          console.log("Create cancelled");
          setShowAddConfirmModal(false);
        }}
        isLoading={isLoading}
      />

      {/* Confirmation of edit product */}
      <ConfirmModal
        show={showEditConfirmModal}
        title="Confirm Edit Product"
        body="Are you sure you want to update this product?"
        onConfirm={() => {
          console.log("Update confirmed");
          handleEditProductOnConfirm(newProductData);
          setShowEditConfirmModal(false);
        }}
        onClose={() => {
          console.log("Update cancelled");
          setShowEditConfirmModal(false);
        }}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Product;
