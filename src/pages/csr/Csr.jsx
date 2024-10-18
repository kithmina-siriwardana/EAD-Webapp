import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import ConfirmModal from "../../components/confirm-modal/ConfirmModal";
import AddCsrModal from "../../components/csr/AddCsr";
import ViewCsrModal from "../../components/csr/ViewCsr";
import { CSR_URLS } from "../../utils/config";
import axios from "axios";

const Csr = () => {
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRating, setSelectedRating] = useState();
  const [showAddCsrModal, setShowAddCsrModal] = useState(false);
  const [showCsrModal, setShowCsrModal] = useState(false);
  const [showAddConfirmModal, setShowAddConfirmModal] = useState(false);
  const [showEditConfirmModal, setShowEditConfirmModal] = useState(false);
  const [csrs, setCsrs] = useState([]);
  const [newCsrData, setNewCsrData] = useState(null);
  const [editCsrId, setEditCsrId] = useState(null);
  const [selectedCsr, setSelectedCsr] = useState(null);
  const [isEdditing, setIsEdditing] = useState(false);
  const [isCsrLoading, setIsCsrLoading] = useState(false);

  // Fetch all csrs
  const fetchAllCsrs = async () => {
    setIsCsrLoading(true);
    await axios
      .get(CSR_URLS.CSR_GET_ALL_CSR_URL)
      .then((response) => {
        console.log(response.data);
        setCsrs(response.data);
        setIsCsrLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Fetch csrs on component mount
  useEffect(() => {
    fetchAllCsrs();
  }, []);

  // Function to handle adding a new csr or editing an existing one
  const handleAddCsr = (csr) => {
    if (editCsrId !== null) {
      // Edit mode
      setNewCsrData(csr);
      setShowEditConfirmModal(true);
      setShowAddCsrModal(false);
    } else {
      // Add mode
      setNewCsrData(csr);
      setShowAddConfirmModal(true);
      setShowAddCsrModal(false);
    }
  };

  // Function to view a csr
  const set = (csr) => {
    console.log("Viewing csr", csr);
    setSelectedCsr(csr);
    setShowCsrModal(true);
  };

  // Function to handle adding a new csr
  const handleAddCsrOnConfirm = async () => {
    console.log("Adding new csr", newCsrData);
    setShowAddCsrModal(false);
  };

  // Function to handle editing an existing csr
  const handleEditCsrOnConfirm = () => {
    console.log("Updating exsisting csr", newCsrData);
    setCsrs((prevCsrs) =>
      prevCsrs.map((p) => (p.id === newCsrData.id ? newCsrData : p))
    );
    setEditCsrId(null); // Reset edit mode
    setShowAddCsrModal(false);
  };

  // Function to handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  // Function to handle rating filter change
  const handleRatingChange = (e) => {
    setSelectedRating(e.target.value);
  };

  // Function to filter csrs based on search query and rating
  const filteredCsrs = csrs.filter((csr) => {
    const matchesSearch =
      csr.fullName.toLowerCase().includes(searchQuery) ||
      csr.userId.toLowerCase().includes(searchQuery);

    const matchesRating = selectedRating
      ? csr.averageRating >= selectedRating &&
        csr.averageRating < selectedRating + 1
      : true;

    // return matchesSearch;
    return matchesSearch && matchesRating;
  });

  // Function to handle edit button click
  const handleEdit = (id) => {
    const csrToEdit = csrs.find((csr) => csr.userId === id);
    setNewCsrData(csrToEdit);
    setEditCsrId(id);
    setShowAddCsrModal(true);
  };

  // Function to handle delete button click
  const handleDelete = (id) => {
    console.log(`Delete csr with ID: ${id}`);
    setShowModal(true);
  };

  // Function to handle add new csr button click
  const handleAdd = () => {
    console.log("Add new csr button clicked");
    setEditCsrId(null);
    setNewCsrData(null);
    setShowAddCsrModal(true);
  };

  const handleAddCsrSuccess = () => {
    setShowAddCsrModal(false);
    fetchAllCsrs();
  };

  const deleteCsr = async (id) => {
    // await axios
    //   .delete(`${AUTH_URLS.csr_DELETE_URL}/${id}`)
    //   .then((response) => {
    //     console.log(response.data);
    //     fetchAllCsrs();
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  };

  return (
    <div className="px-4 my-4">
      {/* Header text */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>List of All CSRs</h1>
        <Button variant="primary" onClick={handleAdd}>
          Create a new CSR
        </Button>
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
        <h4>Search CSRs</h4>
        <div className="d-flex justify-content-between align-items-center">
          <input
            type="text"
            className="form-control w-25"
            placeholder="Search by ID, name, or email"
            onChange={handleSearchChange}
          />

          {/* Filter by Rating
          <select
            className="form-select w-25"
            value={selectedRating}
            onChange={handleRatingChange}
          >
            <option value="">Filter by Rating</option>
            <option value="1">1 Star</option>
            <option value="2">2 Stars</option>
            <option value="3">3 Stars</option>
            <option value="4">4 Stars</option>
            <option value="5">5 Stars</option>
          </select> */}
        </div>
      </div>

      {/* Table */}
      <div>
        {/* Csr Table */}
        {isCsrLoading ? (
          <div
            className="spinner-border"
            style={{ width: "3rem", height: "3rem" }}
            role="status"
          ></div>
        ) : (
          <>
            <Table bordered hover>
              <thead>
                <tr>
                  <th>CSR ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCsrs.map((csr) => (
                  <tr
                    style={{ cursor: "pointer" }}
                    key={csr.userId}
                    onClick={() => set(csr)}
                  >
                    <td>{csr.userId}</td>
                    <td>{csr.fullName}</td>
                    <td>{csr.email}</td>

                    <td>
                      <Button
                        variant="warning"
                        className="me-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(csr.userId);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(csr.id);
                        }}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        )}
      </div>

      {/* Add Csr Modal */}
      <AddCsrModal
        show={showAddCsrModal}
        onClose={() => {
          setShowAddCsrModal(false);
        }}
        onAddCsr={handleAddCsr}
        initialData={newCsrData}
        editCsrId={editCsrId}
        onSuccess={handleAddCsrSuccess}
      />

      <ViewCsrModal
        show={showCsrModal}
        onClose={() => setShowCsrModal(false)}
        csrData={selectedCsr}
      />

      {/* Confirmation of delete csr */}
      <ConfirmModal
        show={showModal}
        title="Delete Csr"
        body="Are you sure you want to delete this csr?"
        onConfirm={() => {
          console.log("Delete confirmed");
          setShowModal(false);
          deleteCsr(selectedCsr.id);
        }}
        onClose={() => {
          console.log("Delete cancelled");
          setShowModal(false);
        }}
      />

      {/* Confirmation of add new csr */}
      <ConfirmModal
        show={showAddConfirmModal}
        title="Confirm New Csr"
        body="Are you sure you want to add this csr?"
        onConfirm={() => {
          console.log("Create csr confirmed");
          handleAddCsrOnConfirm(newCsrData);
          setShowAddConfirmModal(false);
        }}
        onClose={() => {
          console.log("Create cancelled");
          setShowAddConfirmModal(false);
        }}
      />

      {/* Confirmation of edit csr */}
      <ConfirmModal
        show={showEditConfirmModal}
        title="Confirm Edit Csr"
        body="Are you sure you want to update this csr?"
        onConfirm={() => {
          console.log("Update confirmed");
          handleEditCsrOnConfirm(newCsrData);
          setShowEditConfirmModal(false);
        }}
        onClose={() => {
          console.log("Update cancelled");
          setShowEditConfirmModal(false);
        }}
      />
    </div>
  );
};

export default Csr;
