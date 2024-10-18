import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import ProductViewContent from "../product/productViewContent";
import { ORDER_URLS, ORDER_ITEMS } from "../../utils/config";
import axios from "axios";

const ViewOrderModal = ({
  show,
  onClose,
  order,
  setIsOrderUpdated,
  isOrderUpdated,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showProductView, setShowProductView] = useState(false);
  const [orderItems, setOrderItems] = useState([]);
  const [orderStatus, setOrderStatus] = useState("");

  const loggedInUser = JSON.parse(localStorage.getItem("auth"));

  //initialize order data
  useEffect(() => {
    if (order) {
      setOrderItems(order.orderItems);
    }
  }, [order]);

  //handle confirmation model
  const handleConfirmationModel = () => {
    setShowModal(!showModal);
  };

  const updateOrderStatus = async () => {
    try {
      await axios
        .patch(`${ORDER_URLS.ORDER_STATUS_UPDATE_URL}/${order.orderId}`, {
          newStatus: orderStatus,
        })
        .then((response) => {
          console.log("response", response);
          alert("Order status updated successfully");
          setIsOrderUpdated(!isOrderUpdated);
          setShowModal(false);
          onClose();
        });
    } catch (error) {
      alert("Failed to update order status. Please try again.");
      setShowModal(false);
      onClose();
    }
  };

  //enable product view
  const handleProductView = () => {
    setShowProductView(!showProductView);
  };

  //enable or disable delete confirmation
  const handleDeleteOrder = async () => {
    setShowDeleteConfirmation(!showDeleteConfirmation);
  };

  //delete order
  const deleteOrder = async () => {
    try {
      await axios
        .patch(`${ORDER_URLS.ORDER_DELETE_URL}/${order.orderId}`, {
          newStatus: "Deleted",
          note: "",
        })
        .then((response) => {
          setShowDeleteConfirmation(false);
        });
    } catch (error) {
      alert("Failed to delete order. Please try again.");
    }
  };

  //update order items
  const updateOrderItems = async (id, status) => {
    console.log("id", id);
    console.log("status", status);
    try {
      const orderData = {
        newStatus: status,
      };
      await axios
        .patch(`${ORDER_ITEMS.ORDER_UPDATE_ITEMS_URL}/${id}`, orderData, {})
        .then((response) => {
          alert("order item status updated successfully");
        });
    } catch (error) {
      alert("Failed to delete order. Please try again.");
    }
  };
  const productData = {};

  if (!order) return null; // Return null if no order is provided

  return (
    <Modal
      show={show}
      onHide={() => {
        setShowModal(false);
        onClose();
      }}
      size={showModal || showDeleteConfirmation ? "md" : "xl"}
      scrollable
    >
      <Modal.Header closeButton style={{ backgroundColor: "#edf2fd" }}>
        {showModal ? (
          <Modal.Title>Confirm Save Changes</Modal.Title>
        ) : (
          <>
            {showDeleteConfirmation ? (
              <Modal.Title>Confirm delete the order</Modal.Title>
            ) : (
              <Modal.Title>Order Details - {order.orderId}</Modal.Title>
            )}
          </>
        )}
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: "#f7f8ff" }}>
        {showModal ? (
          <>
            <div>
              <span>Are you sure you want to save changes?</span>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "20px",
                }}
              >
                <Button
                  variant="warning"
                  onClick={handleConfirmationModel}
                  style={{ minWidth: "80px", marginRight: "10px" }}
                >
                  No
                </Button>
                <Button
                  variant="success"
                  onClick={updateOrderStatus}
                  style={{ minWidth: "80px" }}
                >
                  Yes
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            {showDeleteConfirmation ? (
              <>
                <div>
                  <span>Are you sure you want to delete this order?</span>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginTop: "20px",
                    }}
                  >
                    <Button
                      variant="warning"
                      onClick={handleDeleteOrder}
                      style={{ minWidth: "80px", marginRight: "10px" }}
                    >
                      No
                    </Button>
                    <Button
                      variant="success"
                      onClick={deleteOrder}
                      style={{ minWidth: "80px" }}
                    >
                      Yes
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {showProductView ? (
                  <ProductViewContent productData={productData} />
                ) : (
                  <div style={{ minHeight: "400px" }}>
                    <p>
                      <strong>Order ID: {order.orderId}</strong>
                    </p>
                    <p>
                      <strong>Total Price:</strong> ${order.totalPrice}
                    </p>
                    <p>
                      <strong>Placed Date:</strong>{" "}
                      {new Date(order.createdDate).toISOString().split("T")[0]}
                    </p>
                    <p>
                      <strong>Order Status:</strong>{" "}
                      <select
                        style={{
                          padding: "5px 10px",
                          borderRadius: "20px",
                          marginLeft: "10px",
                        }}
                        disabled={loggedInUser.role !== "Admin"}
                        defaultValue={order.status}
                        onChange={(e) => {
                          setOrderStatus(e.target.value);
                          console.log("order status", e.target.value);
                        }}
                      >
                        <option value="Purchased">Purchased</option>
                        <option value="Processing">Processing</option>
                        <option value="Dispatched">Dispatched</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </p>
                    {order.note !== "" && (
                      <p>
                        <strong>Order cancelation request:</strong>{" "}
                        <span style={{ color: "red" }}>{order.note}</span>
                      </p>
                    )}
                    <Button variant="danger" onClick={handleDeleteOrder}>
                      Delete this Order
                    </Button>
                    <p style={{ marginTop: "20px" }}>
                      <strong>Products:</strong>
                    </p>
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
                          <th>Vendor</th>
                          <th>Price</th>
                          <th>Quantity</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orderItems && orderItems.length > 0 ? (
                          orderItems.map((item) => (
                            <tr
                              key={item.productId}
                              style={{ cursor: "pointer" }}
                            >
                              <td onClick={handleProductView}>
                                {item.productId}
                              </td>
                              <td onClick={handleProductView}>
                                {item.productName}
                              </td>
                              <td onClick={handleProductView}>
                                {item.vendorId}
                              </td>
                              <td onClick={handleProductView}>{item.price}</td>
                              <td onClick={handleProductView}>
                                {item.quantity}
                              </td>
                              <td>
                                <select
                                  style={{
                                    padding: "5px 10px",
                                    borderRadius: "20px",
                                  }}
                                  defaultValue={item.status}
                                  onChange={(e) => {
                                    updateOrderItems(item.id, e.target.value);
                                  }}
                                >
                                  {" "}
                                  <option value="Processing">Processing</option>
                                  <option value="Purchased">Purchased</option>
                                  <option value="Dispatched">Dispatched</option>
                                  <option value="Delivered">Delivered</option>
                                  <option value="Cancelled">Cancelled</option>
                                </select>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6">No products found</td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </Modal.Body>
      <Modal.Footer style={{ backgroundColor: "#edf2fd" }}>
        {!showModal && !showDeleteConfirmation && (
          <span>
            <Button variant="primary" onClick={handleConfirmationModel}>
              Save
            </Button>
          </span>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default ViewOrderModal;
