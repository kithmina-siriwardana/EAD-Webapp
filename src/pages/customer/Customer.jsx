import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import ConfirmModal from "../../components/confirm-modal/ConfirmModal";
import ViewCustomerModal from "../../components/customer/ViewCustomer";
import { PRODUCT_URLS, USER_URLS } from "../../utils/config";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const Customer = () => {
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState();
  const [selectedImages, setSelectedImages] = useState([]);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [showAddConfirmModal, setShowAddConfirmModal] = useState(false);
  const [showEditConfirmModal, setShowEditConfirmModal] = useState(false);
  const [showViewCustomerModal, setShowViewCustomerModal] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editModal, setEditModal] = useState(false);
  const [newCustomerData, setNewCustomerData] = useState(null);
  const [editCustomerId, setEditCustomerId] = useState(null);
  const [isCustomerUpdated, setIsCustomerUpdated] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isLoadingCustomer, setIsLoadingCustomer] = useState(false);

  // Function to handle customer fetch
  const fetchCustomers = async () => {
    try {
      setIsLoadingCustomer(true);
      const response = await fetch(USER_URLS.USER_GET_CUSTOMERS_URL);
      const data = await response.json();
      console.log("Customers: ", data);
      setCustomers(data);
      setIsLoadingCustomer(false);
    } catch (error) {
      setIsLoadingCustomer(false);
      console.error("Error fetching customers", error);
    }
  };

  // Fetch customers on component mount
  useEffect(() => {
    fetchCustomers();
    setIsLoading(false);
  }, [isCustomerUpdated]);

  // Function to handle adding a new customer or editing an existing one
  const handleAddCustomer = (customer, images) => {
    if (editCustomerId !== null) {
      // Edit mode
      setNewCustomerData(customer);
      setSelectedImages(images);
      setShowEditConfirmModal(true);
      setShowAddCustomerModal(false);
    } else {
      // Add mode
      setNewCustomerData(customer);
      setSelectedImages(images);
      setShowAddConfirmModal(true);
      setShowAddCustomerModal(false);
    }
  };

  // Function to handle adding a new customer
  const handleAddCustomerOnConfirm = async () => {
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", newCustomerData.name);
      formData.append("description", newCustomerData.description);
      formData.append("price", newCustomerData.price);
      formData.append("categoryID", newCustomerData.category);
      formData.append("vendorID", newCustomerData.vendor);
      // formData.append("isActive", newCustomerData.status);

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
          toast.success("Customer added successfully!");
          setShowAddCustomerModal(false);
          setIsCustomerUpdated(true);
        });
    } catch (error) {
      console.error("Error adding customer:", error);
      toast.error("Failed to add customer. Please try again.");
    }
    setIsLoading(false);
  };

  // Function to handle editing an existing customer
  const handleEditCustomerOnConfirm = async () => {
    console.log("Updating exsisting customer", newCustomerData);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", newCustomerData.name);
      formData.append("description", newCustomerData.description);
      formData.append("price", newCustomerData.price);
      formData.append("categoryID", newCustomerData.category);
      formData.append("customerId", newCustomerData.customerId);
      formData.append("vendorID", newCustomerData.vendor);
      // formData.append("isActive", newCustomerData.status);

      // Append image files if you have any
      selectedImages.forEach((image) => {
        formData.append("images", image.file);
      });

      await axios
        .put(PRODUCT_URLS.PRODUCT_UPDATE_URL, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          toast.success("Customer added successfully:");
          setShowAddCustomerModal(false);
          setIsCustomerUpdated(true);
        });
    } catch (error) {
      toast.error("Failed to add customer. Please try again.");
    }
    setIsLoading(false);

    setEditCustomerId(null); // Reset edit mode
    setShowAddCustomerModal(false);
  };

  // Function to handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  // Function to handle status filter change
  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  // Function to filter customers based on search query and category
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.fullName.toLowerCase().includes(searchQuery) ||
      customer.userId.toLowerCase().includes(searchQuery) ||
      customer.email.toString().includes(searchQuery);

    const matchesStatus = selectedStatus
      ? (customer.isApproved === true ? "approved" : "pending") ===
        selectedStatus.toLowerCase()
      : true;

    return matchesSearch && matchesStatus;
  });

  // Function to handle edit button click
  const handleEdit = (id) => {
    setEditModal(true);
    const customerToEdit = customers.find((customer) => customer.id === id);
    setNewCustomerData(customerToEdit);
    setEditCustomerId(id);
    setShowAddCustomerModal(true);
  };

  // Function to handle delete button click
  const handleDelete = (id) => {
    console.log(`Delete customer with ID: ${id}`);
    setEditCustomerId(id);
    setShowModal(true);
  };

  // Function to handle delete confirmation ///////////////////////////////////// Check this /////////////////////////////////////
  const handleDeleteConfirm = () => {
    console.log("Delete confirmed");

    axios
      .put(PRODUCT_URLS.PRODUCT_DELETE_URL, {
        data: {
          customerId: editCustomerId,
          vendorId: "VEND140845",
          isDeleted: true,
        },
      })
      .then((response) => {
        toast.success("Customer deleted successfully");
        setIsCustomerUpdated(true);
      })
      .catch((error) => {
        console.error("Error deleting customer:", error);
        toast.error("Failed to delete customer. Please try again.");
      });

    setShowModal(false);
  };

  // Function to handle add button click
  const handleAdd = () => {
    setEditModal(true);
    setNewCustomerData({
      id: "",
      name: "",
      vendor: "",
      price: "",
      category: "",
    });
    setSelectedImages([]);
    setEditCustomerId(null);
    setShowAddCustomerModal(true);
  };

  //handle customer view
  const handleCustomerView = (id) => {
    const customerToView = customers.find((customer) => customer.id === id);
    setNewCustomerData(customerToView);
    setShowViewCustomerModal(true);
  };

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // You can set this to any number of items per page

  // Calculate total pages based on filtered customers
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  // Calculate the customers for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCustomers = filteredCustomers.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Function to handle page change
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Function to handle displaying customer details
  const handleViewDetails = (order) => {
    setSelectedCustomer(order);
    setShowCustomerModal(true);
  };

  return (
    <div className="px-4 my-4">
      {/* Header text */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>List of All Customers</h1>
        {/* <Button variant="primary" onClick={handleAdd}>
          Add New Customer
        </Button> */}
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
        <h4>Search Customers</h4>
        <div className="d-flex justify-content-between align-items-center">
          <input
            type="text"
            className="form-control w-25"
            placeholder="Search by ID, name, or email"
            onChange={handleSearchChange}
          />

          {/* Filter by Rating */}
          <select
            className="form-select w-25"
            value={selectedStatus}
            onChange={handleStatusChange}
          >
            <option value="">Filter by Status</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div>
        {isLoadingCustomer ? (
          <div
            className="spinner-border"
            style={{ width: "3rem", height: "3rem" }}
            role="status"
          ></div>
        ) : (
          <>
            {filteredCustomers.length == 0 ? (
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
                    <th>Customer ID</th>
                    <th>Customer Name</th>
                    <th>Email </th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer) => (
                    <tr
                      key={customer.userId}
                      onClick={() => handleViewDetails(customer)}
                      style={{ cursor: "pointer" }}
                    >
                      <td onClick={() => handleCustomerView(customer.userId)}>
                        {customer.userId}
                      </td>
                      <td onClick={() => handleCustomerView(customer.userId)}>
                        {customer.fullName}
                      </td>
                      <td onClick={() => handleCustomerView(customer.userId)}>
                        {customer.email}
                      </td>
                      <td onClick={() => handleCustomerView(customer.userId)}>
                        {customer.isApproved ? "Approved" : "Pending"}
                      </td>
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

      {/* Confirmation of delete customer */}
      <ConfirmModal
        show={showModal}
        title="Delete Customer"
        body="Are you sure you want to delete this customer?"
        onConfirm={() => {
          handleDeleteConfirm();
        }}
        onClose={() => {
          console.log("Delete cancelled");
          setShowModal(false);
        }}
        isLoading={isLoading}
      />

      {/* Confirmation of add new customer */}
      <ConfirmModal
        show={showAddConfirmModal}
        title="Confirm New Customer"
        body="Are you sure you want to add this customer?"
        onConfirm={() => {
          console.log("Create confirmed");
          handleAddCustomerOnConfirm(newCustomerData);
          setShowAddConfirmModal(false);
        }}
        onClose={() => {
          console.log("Create cancelled");
          setShowAddConfirmModal(false);
        }}
        isLoading={isLoading}
      />

      {/* Confirmation of edit customer */}
      <ConfirmModal
        show={showEditConfirmModal}
        title="Confirm Edit Customer"
        body="Are you sure you want to update this customer?"
        onConfirm={() => {
          console.log("Update confirmed");
          handleEditCustomerOnConfirm(newCustomerData);
          setShowEditConfirmModal(false);
        }}
        onClose={() => {
          console.log("Update cancelled");
          setShowEditConfirmModal(false);
        }}
        isLoading={isLoading}
      />

      {/* View Order Modal */}
      <ViewCustomerModal
        show={showCustomerModal}
        onClose={() => setShowCustomerModal(false)}
        customer={selectedCustomer}
        isCustomerUpdated={isCustomerUpdated}
        setIsCustomerUpdated={setIsCustomerUpdated}
      />
    </div>
  );
};

export default Customer;
