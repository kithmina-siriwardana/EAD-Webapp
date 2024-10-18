import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import ConfirmModal from "../../components/confirm-modal/ConfirmModal";
import ViewOrderModal from "../../components/order/ViewOrder";
import axios from "axios";
import { ORDER_URLS } from "../../utils/config";
import { Spinner } from "react-bootstrap";

const Order = () => {
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddOrderModal, setShowAddOrderModal] = useState(false);
  const [showAddConfirmModal, setShowAddConfirmModal] = useState(false);
  const [showEditConfirmModal, setShowEditConfirmModal] = useState(false);
  const [showCancelConfirmModal, setShowCancelConfirmModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [cancelOrderId, setCancelOrderId] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [orders, setOrders] = useState([]);
  const [newOrderData, setNewOrderData] = useState(null);
  const [editOrderId, setEditOrderId] = useState(null);
  const [isOrderUpdated, setIsOrderUpdated] = useState(false);
  const loggedInUser = JSON.parse(localStorage.getItem("auth"));

  // Get all Orders
  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `${ORDER_URLS.ORDER_GET_BY_ROLE_URL}/${loggedInUser.userId}`
      );
      const modifiedOrders = response.data.map(({ id, ...rest }) => rest);
      setOrders(modifiedOrders);
    } catch (error) {
      console.error("Error fetching Orders", error);
    }
  };

  // Fetch Orders on component mount
  useEffect(() => {
    fetchOrders();
  }, [loggedInUser && isOrderUpdated]);

  // Function to handle add Order on confirm
  const handleAddOrderOnConfirm = () => {
    console.log("Adding new Order", newOrderData);
    setOrders((prevOrders) => [...prevOrders, newOrderData]);
    setShowAddOrderModal(false);
  };

  // Function to handle cancel Order on confirm
  const handleCancelOrderOnConfirm = () => {
    console.log("Cancelling existing Order:", cancelOrderId);

    // Find the order to cancel
    const orderToCancel = orders.find((p) => p.id === cancelOrderId);

    if (!orderToCancel) {
      console.error("Order not found!");
      return;
    }

    // Create updated order data
    const updatedOrderData = {
      ...orderToCancel,
      status: "Cancelled",
    };

    // Update the orders state with the modified order data
    setOrders((prevOrders) =>
      prevOrders.map((p) => (p.id === cancelOrderId ? updatedOrderData : p))
    );

    setShowCancelConfirmModal(false);
  };

  // Function to handle edit Order on confirm
  const handleEditOrderOnConfirm = () => {
    console.log("Updating exsisting Order", newOrderData);
    setOrders((prevOrders) =>
      prevOrders.map((p) => (p.id === newOrderData.id ? newOrderData : p))
    );
    setEditOrderId(null);
    setShowAddOrderModal(false);
  };

  // Function to handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  // Function to filter Orders based on search query and rating
  const filteredOrders = orders.filter((Order) => {
    if (!Order) return false;

    const matchesSearch =
      Order.totalPrice.toString().includes(searchQuery) ||
      Order.orderId.toString().includes(searchQuery) ||
      Order.customerId.toString().includes(searchQuery);

    const matchesStatus = selectedStatus
      ? Order.status.toLowerCase() === selectedStatus.toLowerCase()
      : true;

    return matchesSearch && matchesStatus;
  });

  // Function to handle displaying order details
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  return (
    <div className="px-4 my-4">
      {/* Header text */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Order Management</h1>
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
        <h4>Search Orders</h4>
        <div className="d-flex justify-content-between align-items-center">
          <input
            type="text"
            className="form-control w-25"
            placeholder="Search by name or total price"
            onChange={handleSearchChange}
          />

          {/* Filter by Status */}
          <select
            className="form-select w-25"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">All</option>
            <option value="purchased">Purchased</option>
            <option value="processing">Processing</option>
            <option value="dispatched">Dispatched</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div>
        {/* Order Table */}
        <Table
          bordered
          hover
          style={{ backgroundColor: "#edf2fd" }}
          className="custom-table"
        >
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer ID</th>
              <th>Total Price</th>
              <th>Placed Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders == false ? (
              <Spinner />
            ) : (
              <>
                {" "}
                {filteredOrders.map((Order) => (
                  <tr
                    key={Order.orderid}
                    onClick={() => handleViewDetails(Order)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{Order.orderId}</td>
                    <td>{Order.customerId}</td>
                    <td>{Order.totalPrice}</td>
                    <td>
                      {new Date(Order.createdDate).toISOString().split("T")[0]}
                    </td>
                    <td>{Order.status}</td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </Table>
      </div>

      {/* Confirmation of delete Order */}
      <ConfirmModal
        show={showModal}
        title="Delete Order"
        body="Are you sure you want to delete this Order?"
        onConfirm={() => {
          console.log("Delete confirmed");
          setShowModal(false);
        }}
        onClose={() => {
          console.log("Delete cancelled");
          setShowModal(false);
        }}
      />

      {/* Confirmation of add new Order */}
      <ConfirmModal
        show={showAddConfirmModal}
        title="Confirm New Order"
        body="Are you sure you want to add this Order?"
        onConfirm={() => {
          console.log("Create confirmed");
          handleAddOrderOnConfirm(newOrderData);
          setShowAddConfirmModal(false);
        }}
        onClose={() => {
          console.log("Create cancelled");
          setShowAddConfirmModal(false);
        }}
      />

      {/* Confirmation of cancel Order */}
      <ConfirmModal
        show={showCancelConfirmModal}
        title="Confirm Cancel Order"
        body="Are you sure you want to cancel this Order?"
        onConfirm={() => {
          console.log("Cancel confirmed");
          handleCancelOrderOnConfirm();
          setCancelOrderId("");
        }}
        onClose={() => {
          console.log("Update cancelled");
          setCancelOrderId("");
          setShowCancelConfirmModal(false);
        }}
      />

      {/* Confirmation of edit Order */}
      <ConfirmModal
        show={showEditConfirmModal}
        title="Confirm Edit Order"
        body="Are you sure you want to update this Order?"
        onConfirm={() => {
          console.log("Update confirmed");
          handleEditOrderOnConfirm(newOrderData);
          setShowEditConfirmModal(false);
        }}
        onClose={() => {
          console.log("Update cancelled");
          setShowEditConfirmModal(false);
        }}
      />

      {/* View Order Modal */}
      <ViewOrderModal
        show={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        order={selectedOrder}
        setIsOrderUpdated={setIsOrderUpdated}
        isOrderUpdated={isOrderUpdated}
        fetchOrders={fetchOrders}
        setSelectedOrder={setSelectedOrder}
      />
    </div>
  );
};

export default Order;
